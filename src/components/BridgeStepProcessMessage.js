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

import { chains } from '../configs/chains';
import { abiBridge } from '../configs/abiBridge';

import MsgBox from './MsgBox';

function BridgeStepProcessMessage(props) {
  const {
    signatures,
    message,
    epoch,
    setFreeze
  } = props;
  
  const {
    address,
    chainId
  } = useAccount();
  
  const {
    data: pmTxid,
    status: pmStatus,
    error: pmError,
    reset: pmReset,
    writeContract: pmWriteContract
  } = useWriteContract();
  const {
    status: pmTxStatus,
    data: pmTxReceipt
  } = useWaitForTransactionReceipt({ hash: pmTxid });
  
  useEffect(function() {
    if(transferTxStatus != 'success')
      return;
    
    //
  }, [pmTxStatus]);
  
  function pm() {
    transferWriteContract({
      address: chains[chainId].contract,
      abi: abiBridge,
      functionName: 'transferERC20',
      args: [
        assets[asset].contracts[chainId],
        dstChain,
        address,
        amount.toFixed(0)
      ]
    });
  };
  
  function pmRetry() {
    pmReset();
    pm();
  };
  
  if(pmStatus == 'success' && pmTxStatus == 'error')
    return (
      <MDBBtn block onClick={pmRetry}>
        Process message transaction reverted. Retry?
      </MDBBtn>
    );
  else if(pmStatus == 'success' && pmTxStatus == 'pending')
     return (
       <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Waiting for confirmation... (Process message)
      </MDBBtn>
     );
  else if(pmStatus == 'error')
    return (
      <>
        <MsgBox title='Error'>
          {pmError.shortMessage}
        </MsgBox>
        <MDBBtn block onClick={pmRetry}>
          Process message transaction failed. Retry?
        </MDBBtn>
      </>
    );
  else if(pmStatus == 'pending')
    return (
       <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Processing message...
      </MDBBtn>
     );
  else if(pmStatus == 'idle')
    return (
      <MDBBtn block onClick={pm}>
        Process message
      </MDBBtn>
    );
}

export default BridgeStepProcessMessage;
