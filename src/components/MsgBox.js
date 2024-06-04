import { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

function MsgBox(props) {
  const {
    title
  } = props;
  
  const [basicModal, setBasicModal] = useState(true);
  
  return (
    <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{title}</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={() => setBasicModal(false)}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>{props.children}</MDBModalBody>

          <MDBModalFooter>
            <MDBBtn onClick={() => setBasicModal(false)}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default MsgBox;
