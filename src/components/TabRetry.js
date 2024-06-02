import { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBRow
} from 'mdb-react-ui-kit';
import { useAccount } from 'wagmi';

import { chains } from '../configs/Chains';

import SelectChain from './SelectChain';
import ConnectWallet from './ConnectWallet';
import RetryStepScan from './RetryStepScan';

function TabRetry() {
  const [requiredChain, setRequiredChain] = useState(null);
  
  const { chainId } = useAccount();
  
  useEffect(function() {
    if(chainId && !requiredChain)
      setRequiredChain(chainId);
  }, [chainId]);
  
  return (
    <>
      <MDBRow className="mb-4">
        <MDBCol className='my-auto'>
          Source chain:
        </MDBCol>
        <MDBCol>
          <SelectChain options={chains} value={requiredChain} onChange={setRequiredChain} />
        </MDBCol>
      </MDBRow>
      
      {chainId && (
        <ConnectWallet requiredChain={requiredChain}>
          <h1>test</h1>
        </ConnectWallet>
      )}
    </>
  );
}

export default TabRetry;
