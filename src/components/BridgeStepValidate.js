import {
  MDBBtn
} from 'mdb-react-ui-kit';
import BigNumber from 'bignumber.js';

import { assets } from '../configs/assets';

import BridgeStepMessage from './BridgeStepMessage';

function BridgeStepValidate(props) {
  const {
    asset,
    srcChain,
    dstChain
  } = props;
  const amount = props.amount
    ? new BigNumber(props.amount).shiftedBy(assets[asset].decimals)
    : null;
  
  const valid = amount && amount != 0 && srcChain && dstChain;
  
  return (amount && amount != 0 && srcChain && dstChain) ? (
    <BridgeStepMessage
     asset={asset}
     amount={amount}
     srcChain={srcChain}
     dstChain={dstChain}
    />
  ) : (
    <MDBBtn block disabled>
      Continue
    </MDBBtn>
  );
}

export default BridgeStepValidate;
