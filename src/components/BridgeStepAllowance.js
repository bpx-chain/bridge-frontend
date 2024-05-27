import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { erc20Abi } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import BigNumber from 'bignumber.js';

import { assets } from '../configs/Assets';
import { chains } from '../configs/Chains';

import BridgeStepTransfer from './BridgeStepTransfer';

function BridgeStepAllowance(props) {
  const {
    data: allowance,
    status: allowanceStatus
  } = useReadContract({
    abi: erc20Abi,
    address: assets[props.asset].contracts[props.srcChain],
    functionName: 'allowance',
    args: [
      props.address,
      chains[props.srcChain].contract
    ]
  });
  const {
    data: approveTxid,
    status: approveStatus,
    reset: approveReset,
    writeContract: approveWriteContract
  } = useWriteContract();
  const {
    status: approveTxStatus
  } = useWaitForTransactionReceipt({ hash: approveTxid });
  
  const allowanceWei = allowanceStatus == 'success' ? new BigNumber(allowance) : null;
  
  function approve() {
    approveWriteContract({
      address: assets[props.asset].contracts[props.srcChain],
      abi: erc20Abi,
      functionName: 'approve',
      args: [
        chains[props.srcChain].contract,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ]
    });
  };
  
  function approveRetry() {
    approveReset();
    approve();
  };
  
  if(approveStatus == 'success' && approveTxStatus == 'error')
    return (
      <MDBBtn block onClick={approveRetry}>
        Approve transaction reverted. Retry?
      </MDBBtn>
    );
  else if(approveStatus == 'success' && approveTxStatus == 'pending')
     return (
       <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Waiting for confirmation... (Approve {props.asset})
      </MDBBtn>
     );
  else if(approveStatus == 'error')
    return (
      <MDBBtn block onClick={approveRetry}>
        Approve transaction failed. Retry?
      </MDBBtn>
    );
  else if(approveStatus == 'pending')
    return (
       <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Approving {props.asset}...
      </MDBBtn>
     );
  else if(allowanceStatus == 'error')
    return (
      <MDBBtn block>
        Allowance check failed
      </MDBBtn>
    );
  else if(allowanceStatus == 'pending')
    return (
      <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Checking allowance...
      </MDBBtn>
    );
  else if(props.amountWei > allowanceWei)
    return (
      <MDBBtn block onClick={approve}>
        Approve {props.asset}
      </MDBBtn>
    );
  else
    return (
      <BridgeStepTransfer {...props} />
    );
}

export default BridgeStepAllowance;
