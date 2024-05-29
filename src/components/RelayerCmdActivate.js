import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBBtn
} from 'mdb-react-ui-kit';
import { useAccount, useReadContract } from 'wagmi';
import BigNumber from 'bignumber.js';

import { chains } from '../configs/Chains';
import { abiBridge } from '../configs/AbiBridge';

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
  
  return relayerGetStakeStatus == 'success' && (
    <MDBCard border className='p-3'>
      <MDBRow>
        <MDBCol size='9'>
          <small>
            <div>
              <strong><u>Activate a relayer</u></strong>
            </div>
            <div className='mt-2'>
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
            </div>
          </small>
        </MDBCol>
        <MDBCol size='3' className='my-auto'>
          <MDBBtn block>
            Submit
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBCard>
  );
}

export default RelayerCmdActivate;
