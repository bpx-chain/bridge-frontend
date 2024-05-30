import { useState, useEffect } from 'react';
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
    open,
    title
  } = props;
  
  const [basicModal, setBasicModal] = useState(open);
  
  useEffect(function() {
    setBasicModal(open);
  }, [open]);
  
  const toggleOpen = () => setBasicModal(!basicModal);
  
  return (
    <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{title}</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>{props.children}</MDBModalBody>

          <MDBModalFooter>
            <MDBBtn onClick={toggleOpen}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default MsgBox;
