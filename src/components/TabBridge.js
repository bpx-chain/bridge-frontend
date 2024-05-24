import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import Select from 'react-select'

const options = [
  {
    value: 'chocolate',
    label: (
      <>
        <MDBIcon fas icon='bridge-water' className='me-2' />
        USDT
      </>
    )
  },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

function TabBridge() {
  return (
    <form>
      <MDBRow className="mb-2">
        <MDBCol>
          Transfer asset:
        </MDBCol>
      </MDBRow>
      
      <MDBRow className="mb-4">
        <MDBCol>
          <Select options={options} />
        </MDBCol>
        <MDBCol>
          <MDBInput style={{ height: '39.59px' }} disabled type='number' id='form1Example1' label='Amount' />
        </MDBCol>
      </MDBRow>
      
      <MDBRow className="mb-2">
        <MDBCol>
          From chain:
        </MDBCol>
        <MDBCol>
          To chain:
        </MDBCol>
      </MDBRow>
      
      <MDBRow className="mb-4">
        <MDBCol>
          <Select isDisabled={true} options={options} />
        </MDBCol>
        <MDBCol>
          <Select isDisabled={true} options={options} />
        </MDBCol>
      </MDBRow>

      <MDBBtn type='submit' block>
        Continue
      </MDBBtn>
    </form>
  );
}

export default TabBridge;
