import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useAccount } from 'wagmi';

import { chains } from '../configs/Chains';

function RelayerStatus(props) {
  const { address, chainId } = useAccount();
  const { relayerStatus, relayerGetStatusStatus } = props;
  
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
  
  return (
    <MDBCard border className='p-2 mt-4' style={{ backgroundColor: '#ececec' }}>
      <MDBRow>
        <MDBCol size='auto' className='my-auto'>
          <MDBIcon icon={icon} spin={relayerGetStatusStatus == 'success'} color={color} className='p-3 fa-2xl' />
        </MDBCol>
        <MDBCol>
          <small>
            <MDBRow>
              <MDBCol size='6'>
                <strong>Destination chain:</strong>
                <br />
                <img src={chains[chainId].icon} width="16" height="16" className="me-1" />
                {chains[chainId].name}
              </MDBCol>
              <MDBCol size='6'>
                <strong>Wallet:</strong>
                <br />
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
          </small>
        </MDBCol>
      </MDBRow>
    </MDBCard>
  );
}

export default RelayerStatus;
