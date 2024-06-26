import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
} from 'mdb-react-ui-kit';

import SynapseStatus from './SynapseStatus';
import { ReactComponent as Logo } from '../assets/logo.svg';

function Navbar() {
  return (
    <MDBNavbar light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand className='me-auto' href='/'>
          <Logo width="auto" height="32" />
          <h4 className="ms-2 my-auto">Bridge</h4>
        </MDBNavbarBrand>
        
        <SynapseStatus />
        <w3m-button balance='hide' />
      </MDBContainer>
    </MDBNavbar>
  );
}

export default Navbar;
