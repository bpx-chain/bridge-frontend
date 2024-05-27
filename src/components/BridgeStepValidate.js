import {
  MDBBtn
} from 'mdb-react-ui-kit';
import BigNumber from 'bignumber.js';

import BridgeStepWalletConnect from './BridgeStepWalletConnect';

function BridgeStepValidate(props) {
  const valid = props.amount && props.amount != 0 && props.srcChain && props.dstChain;
  const amountWei = valid ? new BigNumber(props.amount) : null;
  
  if(valid)
    return (
      <BridgeStepWalletConnect amountWei={amountWei} {...props} />
    );
  
  return (
    <MDBBtn block disabled>
      Continue
    </MDBBtn>
  );
}

export default BridgeStepValidate;
