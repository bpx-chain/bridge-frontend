import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
} from 'mdb-react-ui-kit';
import { ReactComponent as Logo } from '../assets/logo.svg';

function Navbar() {
  return (
    <MDBNavbar light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/'>
            <Logo width="auto" height="32" />
            <h4 class="ms-2 my-auto">Bridge</h4>
        </MDBNavbarBrand>
        
        <w3m-button />
      </MDBContainer>
    </MDBNavbar>
  );
}

export default Navbar;
