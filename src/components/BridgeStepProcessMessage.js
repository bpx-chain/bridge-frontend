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
import {
  estimateFeesPerGas,
  estimateGas
} from '@wagmi/core';
import BigNumber from 'bignumber.js';

import { chains } from '../configs/chains';
import { abiBridge } from '../configs/abiBridge';
import { config } from './WalletProvider';

import MsgBox from './MsgBox';

function BridgeStepProcessMessage(props) {
  const {
    signatures,
    message,
    epoch,
    setFreeze,
    setSuccess
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
    if(pmTxStatus != 'success')
      return;
    
    setSuccess(true);
  }, [pmTxStatus]);
  
  async function pm() {
    const fees = await estimateFeesPerGas(config);
    
    const value = new BigNumber(fees.maxFeePerGas).times(21000);
    
    const estimate = await estimateGas(config, {
      address: chains[chainId].contract,
      abi: abiBridge,
      functionName: 'messageProcess',
      args: [
        message.messageBody,
        signatures,
        epoch
      ],
      value,
      maxFeePerGas: fees.maxFeePerGas,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas
    });
    
    pmWriteContract({
      address: chains[chainId].contract,
      abi: abiBridge,
      functionName: 'messageProcess',
      args: [
        message.messageBody,
        signatures,
        epoch
      ],
      value,
      maxFeePerGas: fees.maxFeePerGas,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas
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
