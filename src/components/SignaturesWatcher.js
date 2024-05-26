import {
  MDBCard,
  MDBCol,
  MDBRow,
  MDBIcon
} from 'mdb-react-ui-kit';

function SignaturesWatcher(props) {
  return (
    <MDBCard border className='p-2' style={{ backgroundColor: '#ececec' }}>
      <MDBRow>
        <MDBCol>
          <MDBIcon icon='circle-notch' spin className='me-2' />
          <strong>Waiting for signatures...</strong>
        </MDBCol>
      </MDBRow>
    </MDBCard>
  );
}

export default SignaturesWatcher;
