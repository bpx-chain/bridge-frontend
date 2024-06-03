import {
  decodeAbiParameters,
  zeroAddress
} from 'viem';
import BigNumber from 'bignumber.js';

import { assets } from '../configs/Assets';

function decodeMessage(message) {
  const homeChainId = 279;
  
  const decodedMessage = decodeAbiParameters(
    [
      { name: 'srcChainId', type: 'uint256' },
      { name: 'dstChainId', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
      { name: 'messageType', type: 'uint256' },
      { name: 'srcDstContract', type: 'address' },
      { name: 'dstAddress', type: 'address' },
      { name: 'value', 'type': 'uint256' }
    ],
    message
  );
  
  let asset;
  const assetContract = decodedMessage[4] == zeroAddress ? null : decodedMessage[4];
  const assetChain = parseInt(decodedMessage[0] == homeChainId ? decodedMessage[1] : decodedMessage[0]);
  for(const [k, v] of Object.entries(assets)) {
    if(v.contracts[assetChain] === assetContract) {
      asset = k;
      break;
    }
  }
  
  return {
    srcChainId: parseInt(decodedMessage[0]),
    dstChainId: parseInt(decodedMessage[1]),
    asset: asset,
    dstAddress: decodedMessage[5],
    value: new BigNumber(decodedMessage[6])
  };
}

export default decodeMessage;
