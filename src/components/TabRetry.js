import {
  MDBCol,
  MDBRow
} from 'mdb-react-ui-kit';
import { useAccount, useSwitchChain } from 'wagmi';

import { chains } from '../configs/Chains';

import SelectChain from './SelectChain';
import RetryScanner from './RetryScanner';

function TabRetry() {
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  
  function handleChangeChain(newValue) {
    switchChain({ chainId: newValue });
  };
  
  return (
    <>
      <MDBRow className="mb-4">
        <MDBCol className='my-auto'>
          Source chain:
        </MDBCol>
        <MDBCol>
          <SelectChain options={chains} value={chainId} onChange={handleChangeChain} /> 
        </MDBCol>
      </MDBRow>
      
      <RetryScanner />
    </>
  );
}

export default TabRetry;
