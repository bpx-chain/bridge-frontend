import { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBRow
} from 'mdb-react-ui-kit';
import { useAccount } from 'wagmi';

import { chains } from '../configs/chains';

import SelectChain from './SelectChain';
import ConnectWallet from './ConnectWallet';
import RetryStepScan from './RetryStepScan';
import BridgeStepSignatures from './BridgeStepSignatures';

function TabRetry() {
  const [srcChain, setSrcChain] = useState(null);
  const [message, setMessage] = useState(null);
  
  const { chainId } = useAccount();
  
  useEffect(function() {
    if(chainId && !srcChain)
      setSrcChain(chainId);
  }, [chainId, srcChain]);
  
  return (
    <>
      <MDBRow className="mb-4">
        <MDBCol className='my-auto'>
          Source chain:
        </MDBCol>
        <MDBCol>
          <SelectChain options={chains} value={srcChain} onChange={setSrcChain} disabled={!!message} />
        </MDBCol>
      </MDBRow>
      
      {message ? (
        <>
          <MDBRow className="mb-4">
            <MDBCol className='my-auto'>
              Message hash:
            </MDBCol>
            <MDBCol>
              <small>{message.messageHash}</small>
            </MDBCol>
          </MDBRow>
          <ConnectWallet requiredChain={message.dstChainId}>
            <BridgeStepSignatures message={message} requestRetry={true} />
          </ConnectWallet>
        </>
      ) : srcChain && (
        <ConnectWallet requiredChain={srcChain}>
          <RetryStepScan setMessage={setMessage} />
        </ConnectWallet>
      )}
    </>
  );
}

export default TabRetry;
