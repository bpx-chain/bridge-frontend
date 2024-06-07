import { useState } from 'react';

import { assets } from '../configs/assets';
import { chains } from '../configs/chains';

import ConnectWallet from './ConnectWallet';
import BridgeStepAllowance from './BridgeStepAllowance';
import BridgeStepTransfer from './BridgeStepTransfer';
import BridgeStepSignatures from './BridgeStepSignatures';
import BridgeStepSuccess from './BridgeStepSuccess';

function BridgeStepMessage(props) {
  const {
    asset,
    srcChain,
    dstChain
  } = props;
  
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  
  if(success)
    return (
      <BridgeStepSuccess />
    );
  else if(message)
    return (
      <ConnectWallet requiredChain={dstChain}>
        <BridgeStepSignatures message={message} setSuccess={setSuccess} />
      </ConnectWallet>
    );
  else if(assets[asset].contracts[srcChain])
    return (
      <ConnectWallet requiredChain={srcChain}>
        <BridgeStepAllowance {...props}>
          <BridgeStepTransfer setMessage={setMessage} {...props} />
        </BridgeStepAllowance>
      </ConnectWallet>
    );
  else
    return (
      <ConnectWallet requiredChain={srcChain}>
        <BridgeStepTransfer setMessage={setMessage} {...props} />
      </ConnectWallet>
    );
}

export default BridgeStepMessage;
