import { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useSwitchChain } from 'wagmi';

import { assets } from '../configs/Assets';
import { chains } from '../configs/Chains';

import BridgeStepAllowance from './BridgeStepAllowance';
import BridgeStepTransfer from './BridgeStepTransfer';
import BridgeStepSignatures from './BridgeStepSignatures';

function BridgeStepWalletConnect(props) {
  const [message, setMessage] = useState(null);
  
  const { open } = useWeb3Modal();
  const { address, chainId, status } = useAccount();
  const { switchChain } = useSwitchChain();
  
  const requiredChain = message ? props.dstChain : props.srcChain;
  
  function switchToRequiredChain() {
    switchChain({ chainId: requiredChain });
  };
  
  if(status == 'connecting' || status == 'reconnecting')
    return (
      <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Connecting wallet...
      </MDBBtn>
    );
  else if(status == 'disconnected')
    return (
      <MDBBtn block onClick={open}>
        Connect wallet
      </MDBBtn>
    );
  else if(status == 'connected' && chainId != requiredChain)
    return (
      <MDBBtn block onClick={switchToRequiredChain}>
        Switch to {chains[requiredChain].name} network
      </MDBBtn>
    );

  else if(message)
    return (
      <BridgeStepSignatures address={address} message={message} {...props} />
    );
  else if(assets[props.asset].contracts[props.srcChain])
    return (
      <BridgeStepAllowance address={address} setMessage={setMessage} {...props} />
    );
  else
    return (
      <BridgeStepTransfer address={address} setMessage={setMessage} {...props} />
    );
}

export default BridgeStepWalletConnect;
