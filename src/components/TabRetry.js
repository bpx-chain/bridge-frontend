import { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBRow
} from 'mdb-react-ui-kit';
import { useAccount } from 'wagmi';
import { keccak256 } from 'viem';

import { chains } from '../configs/Chains';

import SelectChain from './SelectChain';
import ConnectWallet from './ConnectWallet';
import RetryStepScan from './RetryStepScan';
import BridgeStepSignatures from './BridgeStepSignatures';

function TabRetry() {
  const [srcChain, setSrcChain] = useState(null);
  const [dstChain, setDstChain] = useState(null);
  const [message, setMessage] = useState(null);
  
  const { chainId } = useAccount();
  
  useEffect(function() {
    if(chainId && !srcChain)
      setSrcChain(chainId);
  }, [chainId, srcChain]);
  
  function setRetryContext(newDstChain, newMessage) {
    setDstChain(newDstChain);
    setMessage(newMessage);
  };
  
  return (
    <>
      <MDBRow className="mb-4">
        <MDBCol className='my-auto'>
          Source chain:
        </MDBCol>
        <MDBCol>
          <SelectChain options={chains} value={srcChain} onChange={setSrcChain} />
        </MDBCol>
      </MDBRow>
      
      {message ? (
        <>
          <MDBRow className="mb-4">
            <MDBCol className='my-auto'>
              Message hash:
            </MDBCol>
            <MDBCol>
              <small>{keccak256(message)}</small>
            </MDBCol>
          </MDBRow>
          <ConnectWallet requiredChain={dstChain}>
            <BridgeStepSignatures srcChain={srcChain} message={message} requestRetry={true} />
          </ConnectWallet>
        </>
      ) : (
        <ConnectWallet requiredChain={srcChain}>
          <RetryStepScan setRetryContext={setRetryContext} />
        </ConnectWallet>
      )}
    </>
  );
}

export default TabRetry;
