import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';
import { erc20Abi } from 'viem';
import BigNumber from 'bignumber.js';

import { assets } from '../configs/assets';
import { chains } from '../configs/chains';

import MsgBox from './MsgBox';

BigNumber.set({EXPONENTIAL_AT: 25});

function BridgeStepAllowance(props) {
  const {
    asset,
    children
  } = props;
  
  const {
    address,
    chainId
  } = useAccount();
  
  const {
    data: allowanceRaw,
    status: allowanceStatus
  } = useReadContract({
    abi: erc20Abi,
    address: assets[asset].contracts[chainId],
    functionName: 'allowance',
    args: [
      address,
      chains[chainId].contract
    ]
  });
  const {
    data: approveTxid,
    status: approveStatus,
    error: approveError,
    reset: approveReset,
    writeContract: approveWriteContract
  } = useWriteContract();
  const {
    status: approveTxStatus
  } = useWaitForTransactionReceipt({ hash: approveTxid });
  
  const allowance = allowanceStatus == 'success' ? new BigNumber(allowanceRaw) : null;
  
  function approve() {
    approveWriteContract({
      address: assets[asset].contracts[chainId],
      abi: erc20Abi,
      functionName: 'approve',
      args: [
        chains[chainId].contract,
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
        Waiting for confirmation... (Approve {asset})
      </MDBBtn>
     );
  else if(approveStatus == 'error')
    return (
      <>
        <MsgBox title='Error'>
          {approveError.shortMessage}
        </MsgBox>
        <MDBBtn block onClick={approveRetry}>
          Approve transaction failed. Retry?
        </MDBBtn>
      </>
    );
  else if(approveStatus == 'pending')
    return (
       <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Approving {asset}...
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
  else if(props.amount > allowance)
    return (
      <MDBBtn block onClick={approve}>
        Approve {asset}
      </MDBBtn>
    );
  else
    return children;
}

export default BridgeStepAllowance;
