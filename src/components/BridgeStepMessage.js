import { useState } from 'react';
import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';

import { assets } from '../configs/Assets';
import { chains } from '../configs/Chains';

import ConnectWallet from './ConnectWallet';
import BridgeStepAllowance from './BridgeStepAllowance';
import BridgeStepTransfer from './BridgeStepTransfer';
import BridgeStepSignatures from './BridgeStepSignatures';

function BridgeStepMessage(props) {
  const {
    asset,
    srcChain,
    dstChain
  } = props;
  
  const [message, setMessage] = useState(null);
  
  if(message)
    return (
      <ConnectWallet requiredChain={dstChain}>
        <BridgeStepSignatures message={message} />
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
