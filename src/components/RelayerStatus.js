import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';

import { chains } from '../configs/chains';

function RelayerStatus(props) {
  const { address, chainId } = useAccount();
  const {
    relayerStatus,
    relayerGetStatusStatus,
    balance,
    relayerGetBalanceStatus,
    withdrawalMax,
    relayerGetWithdrawalMaxStatus
  } = props;
  
  const icon = relayerGetStatusStatus == 'success' ? 'circle' : 'circleNotch';
  const color = relayerGetStatusStatus == 'success'
    ? relayerStatus[0] ? 'success' : 'danger'
    : null;
  const status = relayerGetStatusStatus == 'success'
    ? relayerStatus[0] ? 'Active' : 'Inactive'
    : (
      <MDBIcon icon='circle-notch' spin />
    );
  const statusEpoch = relayerGetStatusStatus == 'success'
    ? parseInt(relayerStatus[1])
    : <MDBIcon icon='circle-notch' spin />;
  const statusEpochText = relayerGetStatusStatus == 'success'
    ? relayerStatus[0] ? 'Activation' : 'Deactivation'
    : 'Status';
  const balanceText = relayerGetBalanceStatus == 'success'
    ? new BigNumber(balance).shiftedBy(-18).toString()
    : <MDBIcon icon='circle-notch' spin />;
  const withdrawalMaxText = relayerGetWithdrawalMaxStatus == 'success'
    ? new BigNumber(withdrawalMax).shiftedBy(-18).toString()
    : <MDBIcon icon='circle-notch' spin />;
  
  return (
    <MDBCard border className='p-2 mt-4' style={{ backgroundColor: '#ececec' }}>
      <MDBRow>
        <MDBCol size='auto' className='my-auto'>
          <MDBIcon icon={icon} spin={relayerGetStatusStatus == 'success'} color={color} className='p-3 fa-2xl' />
        </MDBCol>
        <MDBCol>
          <small>
            <MDBRow>
              <MDBCol>
                <strong>Address: </strong>
                {address}
              </MDBCol>
            </MDBRow>
            <MDBRow className='mt-2'>
              <MDBCol size='6'>
                <strong>Relayer status:</strong>
                <br />
                {status}
              </MDBCol>
              <MDBCol size='6'>
                <strong>{statusEpochText} epoch:</strong>
                <br />
                {statusEpoch}
              </MDBCol>
            </MDBRow>
            <MDBRow className='mt-2'>
              <MDBCol size='6'>
                <strong>Balance:</strong>
                <br />
                {balanceText} {chains[chainId].currency}
              </MDBCol>
              <MDBCol size='6'>
                <strong>Available to withdraw:</strong>
                <br />
                {withdrawalMaxText} {chains[chainId].currency}
              </MDBCol>
            </MDBRow>
          </small>
        </MDBCol>
      </MDBRow>
    </MDBCard>
  );
}

export default RelayerStatus;
