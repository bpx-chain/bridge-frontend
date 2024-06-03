import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useAccount, useWriteContract } from 'wagmi';
import BigNumber from 'bignumber.js';

import { chains } from '../configs/chains';
import { abiBridge } from '../configs/abiBridge';

import MsgBox from './MsgBox';

function RelayerCmdWithdraw(props) {
  const { address, chainId } = useAccount();
  const {
    oppChain,
    withdrawalMax,
    relayerGetWithdrawalMaxStatus
  } = props;
  
  const max = new BigNumber(withdrawalMax).shiftedBy(-18).toString();
  
  const {
    writeContract,
    status: writeContractStatus,
    error: writeContractError
  } = useWriteContract();
  
  function submit() {
    writeContract({
      address: chains[chainId].contract,
      abi: abiBridge,
      functionName: 'relayerWithdraw',
      args: [
        oppChain,
        address,
        withdrawalMax
      ],
      value: props.amountWei
    });
  };
  
  return relayerGetWithdrawalMaxStatus == 'success' && (
    <>
      <MsgBox open={!!writeContractError} title='Error'>
        {writeContractError && writeContractError.shortMessage}
      </MsgBox>
      <MDBCard border className='p-3 mt-2'>
        <MDBRow>
          <MDBCol>
            <small><strong><u>Withdrawal from relayer balance</u></strong></small>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol size='9'>
            <small>
              This command will pay out the entire withdrawable
              amount <strong>({max} {chains[chainId].currency})</strong> from
              the relayer balance to your wallet with address <strong>{address}</strong>.
            </small>
          </MDBCol>
          <MDBCol size='3' className='my-auto'>
            <MDBBtn block onClick={submit} disabled={withdrawalMax == 0 || writeContractStatus == 'pending'}>
              {writeContractStatus == 'pending' ? (
                <MDBIcon icon='circle-notch' spin />
              ) : 'Submit'}
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </>
  );
}

export default RelayerCmdWithdraw;
