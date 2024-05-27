import {useState} from 'react';
import {
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import BigNumber from 'bignumber.js';

import SelectAsset from './SelectAsset';
import InputAmount from './InputAmount';
import SelectChain from './SelectChain';
import BridgeStepValidate from './BridgeStepValidate';

import { assets } from '../configs/Assets';
import { chains } from '../configs/Chains';

function TabBridge() {
  const homeChainId = 279;
  
  const [asset, setAsset] = useState(Object.keys(assets)[0]);
  const [amount, setAmount] = useState('');
  const [srcChain, setSrcChain] = useState(null);
  const [dstChain, setDstChain] = useState(null);
    
  function handleChangeAsset(newValue) {
    setAsset(newValue);
    setAmount('');
    setSrcChain(null);
    setDstChain(null);
  };
  
  function handleChangeSrcChain(newValue) {
    setSrcChain(newValue);
    if(newValue != homeChainId)
      setDstChain(homeChainId);
    else if(dstChain == homeChainId)
      setDstChain(null);
  };
  
  function handleChangeDstChain(newValue) {
    setDstChain(newValue);
    if(newValue != homeChainId)
      setSrcChain(homeChainId);
    else if(srcChain == homeChainId)
      setSrcChain(null);
  };
    
  function handleSwapChains() {
    setSrcChain(dstChain);
    setDstChain(srcChain);
  };
  
  const formLocked = false;

  return (
    <>
      <MDBRow className="mb-2">
        <MDBCol>
          <h5>Transfer asset:</h5>
        </MDBCol>
      </MDBRow>

      <MDBRow className="mb-4">
        <MDBCol>
          <SelectAsset options={assets} value={asset} onChange={handleChangeAsset} disabled={formLocked} />
        </MDBCol>
        <MDBCol>
          <InputAmount asset={assets[asset]} value={amount} onChange={setAmount} disabled={formLocked} />
        </MDBCol>
      </MDBRow>

      <MDBRow className="mb-2">
        <MDBCol>
          <h5>From chain:</h5>
        </MDBCol>
        <MDBCol>
          <h5>To chain:</h5>
        </MDBCol>
      </MDBRow>

      <MDBRow className="mb-4">
        <MDBCol>
          <SelectChain options={chains} value={srcChain} onChange={handleChangeSrcChain} disabled={formLocked} /> 
        </MDBCol>
        <MDBCol size='auto' className='px-0 my-auto'>
          <MDBBtn block color='secondary' onClick={handleSwapChains} disabled={formLocked} >
            <MDBIcon icon='right-left' />
          </MDBBtn>
        </MDBCol>
        <MDBCol>
          <SelectChain options={chains} value={dstChain} onChange={handleChangeDstChain} disabled={formLocked} />
        </MDBCol>
      </MDBRow>
      
      <BridgeStepValidate asset={asset} amount={amount ? new BigNumber(amount) : null} srcChain={srcChain} dstChain={dstChain} />
    </>
  );
}

export default TabBridge;
