import { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBRow
} from 'mdb-react-ui-kit';
import { useAccount } from 'wagmi';

import { chains } from '../configs/chains';

import SelectChain from './SelectChain';
import ConnectWallet from './ConnectWallet';
import RelayerConsole from './RelayerConsole';

function TabRelayer() {
  const [requiredChain, setRequiredChain] = useState(null);
  
  const { chainId } = useAccount();
  
  useEffect(function() {
    if(chainId && !requiredChain)
      setRequiredChain(chainId);
  }, [chainId, requiredChain]);
  
  return (
    <>
      <MDBRow className='mb-2'>
        <MDBCol className='my-auto'>
          Query / transact on chain:
        </MDBCol>
        <MDBCol>
          <SelectChain options={chains} value={requiredChain} onChange={setRequiredChain} />
        </MDBCol>
      </MDBRow>
      
      {requiredChain && (
        <ConnectWallet requiredChain={requiredChain}>
          <RelayerConsole />
        </ConnectWallet>
      )}
    </>
  );
}

export default TabRelayer;
