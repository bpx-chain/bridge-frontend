import { useState } from 'react';
import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';

function BridgeStepSuccess() {
  return (
    <MDBBtn color='success' block disabled>
      <MDBIcon icon='circle-check' spin className='me-2' />
      Bridge transaction completed
    </MDBBtn>
  );
}

export default BridgeStepSuccess;
