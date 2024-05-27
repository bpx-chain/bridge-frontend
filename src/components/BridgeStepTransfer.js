import { useEffect } from 'react';
import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { decodeEventLog } from 'viem';

import { assets } from '../configs/Assets';
import { chains } from '../configs/Chains';
import { abiBridge } from '../configs/AbiBridge';

function BridgeStepTransfer(props) {
  const {
    data: transferTxid,
    status: transferStatus,
    reset: transferReset,
    writeContract: transferWriteContract
  } = useWriteContract();
  const {
    status: transferTxStatus,
    data: transferTxReceipt
  } = useWaitForTransactionReceipt({ hash: '0xc498bd3c572802ef398825c3688f4a31b601be0cd700be68875078a5249b3666' }); //transferTxid });
  
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
        props.setMessage(eventDecoded.args.message);
        return;
      }
    }
  }, [transferTxStatus]);
  
  function transfer() {
    if(!assets[props.asset].contracts[props.srcChain])
      transferWriteContract({
        address: chains[props.srcChain].contract,
        abi: abiBridge,
        functionName: 'transfer',
        args: [
          props.dstChain,
          props.address
        ],
        value: props.amountWei
      });
    else
      transferWriteContract({
        address: chains[props.srcChain].contract,
        abi: abiBridge,
        functionName: 'transferERC20',
        args: [
          assets[props.asset].contracts[props.srcChain],
          props.dstChain,
          props.address,
          props.amountWei
        ]
      });
  };
  
  function transferRetry() {
    transferReset();
    transfer();
  };
  
  if(transferStatus != 'success' && transferTxStatus == 'error') /////////////////////////////////////
    return (
      <MDBBtn block onClick={transferRetry}>
        Transfer transaction reverted. Retry?
      </MDBBtn>
    );
  else if(transferStatus != 'success' && transferTxStatus == 'pending') /////////////////////////////////
     return (
       <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Waiting for confirmation... (Transfer {props.asset})
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
        Transferring {props.asset}...
      </MDBBtn>
     );
  else if(transferStatus == 'idle')
    return (
      <MDBBtn block onClick={transfer}>
        Transfer {props.asset}
      </MDBBtn>
    );
}

export default BridgeStepTransfer;
