import { useEffect } from 'react';
import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';
import { decodeEventLog } from 'viem';

import { assets } from '../configs/Assets';
import { chains } from '../configs/Chains';
import { abiBridge } from '../configs/AbiBridge';

import decodeMessage from '../utils/decodeMessage';

function BridgeStepTransfer(props) {
  const {
    asset,
    amount,
    dstChain,
    setMessage
  } = props;
  
  const {
    address,
    chainId
  } = useAccount();
  
  const {
    data: transferTxid,
    status: transferStatus,
    reset: transferReset,
    writeContract: transferWriteContract
  } = useWriteContract();
  const {
    status: transferTxStatus,
    data: transferTxReceipt
  } = useWaitForTransactionReceipt({ hash: transferTxid });
  
  useEffect(function() {
    if(transferTxStatus != 'success')
      return;
    
    for(const event of transferTxReceipt.logs) {
      const eventDecoded = decodeEventLog({
        abi: abiBridge,
        data: event.data,
        topics: event.topics
      });
      if(eventDecoded.eventName == 'MessageCreated') {
        setMessage(decodeMessage(eventDecoded));
        return;
      }
    }
  }, [transferTxStatus]);
  
  function transfer() {
    if(!assets[asset].contracts[chainId])
      transferWriteContract({
        address: chains[chainId].contract,
        abi: abiBridge,
        functionName: 'transfer',
        args: [
          dstChain,
          address
        ],
        value: amount
      });
    else
      transferWriteContract({
        address: chains[chainId].contract,
        abi: abiBridge,
        functionName: 'transferERC20',
        args: [
          assets[asset].contracts[chainId],
          dstChain,
          address,
          amount
        ]
      });
  };
  
  function transferRetry() {
    transferReset();
    transfer();
  };
  
  if(transferStatus == 'success' && transferTxStatus == 'error')
    return (
      <MDBBtn block onClick={transferRetry}>
        Transfer transaction reverted. Retry?
      </MDBBtn>
    );
  else if(transferStatus == 'success' && transferTxStatus == 'pending')
     return (
       <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Waiting for confirmation... (Transfer {asset})
      </MDBBtn>
     );
  else if(transferStatus == 'error')
    return (
      <MDBBtn block onClick={transferRetry}>
        Transfer transaction failed. Retry?
      </MDBBtn>
    );
  else if(transferStatus == 'pending')
    return (
       <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Transferring {asset}...
      </MDBBtn>
     );
  else if(transferStatus == 'idle')
    return (
      <MDBBtn block onClick={transfer}>
        Transfer {asset}
      </MDBBtn>
    );
}

export default BridgeStepTransfer;
