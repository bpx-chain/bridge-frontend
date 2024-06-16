import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import BigNumber from 'bignumber.js';

import { chains } from '../configs/chains';
import { abiBridge } from '../configs/abiBridge';

import MsgBox from './MsgBox';

BigNumber.set({EXPONENTIAL_AT: 25});

function RelayerCmdActivate(props) {
  const { address, chainId } = useAccount();
  const { oppChain } = props;
  
  const {
    data: relayerGetStakeData,
    status: relayerGetStakeStatus
  } = useReadContract({
    abi: abiBridge,
    address: chains[chainId].contract,
    functionName: 'relayerGetStake',
    args: [
      address
    ]
  });
  const relayerStake = relayerGetStakeStatus == 'success'
    ? new BigNumber(relayerGetStakeData).shiftedBy(-18).toString()
    : null;
  
  const {
    writeContract,
    status: writeContractStatus,
    error: writeContractError
  } = useWriteContract();
  
  function submit() {
    writeContract({
      address: chains[chainId].contract,
      abi: abiBridge,
      functionName: 'relayerActivate',
      args: [
        oppChain
      ],
      value: relayerGetStakeData
    });
  };
  
  return relayerGetStakeStatus == 'success' && (
    <>
      {writeContractError && (
        <MsgBox title='Error'>
          {writeContractError.shortMessage}
        </MsgBox>
      )}
      <MDBCard border className='p-3'>
        <MDBRow>
          <MDBCol>
            <small><strong><u>Activate a relayer</u></strong></small>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol size='9'>
            <small>
              <ul>
                <li>
                  This command activates your wallet address as a relayer for transactions coming
                  from <strong>{chains[oppChain].name}</strong> to <strong>{chains[chainId].name}</strong>.
                </li>
                <li>
                  Relayer stake of <strong>{relayerStake} {chains[chainId].currency}</strong> will be deposited
                  with the activation transaction.
                </li>
              </ul>
            </small>
          </MDBCol>
          <MDBCol size='3' className='my-auto'>
            <MDBBtn block onClick={submit} disabled={writeContractStatus == 'pending'}>
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

export default RelayerCmdActivate;
