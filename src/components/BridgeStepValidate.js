import {
  MDBBtn
} from 'mdb-react-ui-kit';
import BigNumber from 'bignumber.js';

import { assets } from '../configs/assets';

import BridgeStepMessage from './BridgeStepMessage';

BigNumber.set({EXPONENTIAL_AT: 25});

function BridgeStepValidate(props) {
  const {
    asset,
    srcChain,
    dstChain,
    formLocked,
    setFormLocked
  } = props;
  const amount = props.amount
    ? new BigNumber(props.amount).shiftedBy(assets[asset].decimals)
    : null;
  
  const valid = amount && amount != 0 && srcChain && dstChain;
  
  return formLocked ? (
    <BridgeStepMessage
     asset={asset}
     amount={amount}
     srcChain={srcChain}
     dstChain={dstChain}
    />
  ) : (
    <MDBBtn block disabled={!valid} onClick={setFormLocked}>
      Continue
    </MDBBtn>
  );
}

export default BridgeStepValidate;
