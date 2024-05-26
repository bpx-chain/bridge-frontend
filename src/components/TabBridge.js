import {useState} from 'react';
import {
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useReadContract } from 'wagmi';
import { useWriteContract } from 'wagmi';
import { erc20Abi } from 'viem';
import BigNumber from "bignumber.js";

import SelectAsset from './SelectAsset';
import InputAmount from './InputAmount';
import SelectChain from './SelectChain';
import { assets } from '../configs/Assets';
import { chains } from '../configs/Chains';
import { abiBridge } from '../configs/AbiBridge';

function TabBridge() {
  const [asset, setAsset] = useState(Object.keys(assets)[0]);
  const [amount, setAmount] = useState('');
  const [srcChain, setSrcChain] = useState(null);
  const [dstChain, setDstChain] = useState(null);
  
  let srcChainOptions = Object.assign({}, chains);
  if(dstChain)
    delete srcChainOptions[dstChain];
  let dstChainOptions = Object.assign({}, chains);
  if(srcChain)
    delete dstChainOptions[srcChain];
    
  function handleChangeAsset(newValue) {
    setAsset(newValue);
    setAmount('');
    setSrcChain(null);
    setDstChain(null);
  };
    
  function handleSwapChains() {
    setSrcChain(dstChain);
    setDstChain(srcChain);
  }
    
  const { open } = useWeb3Modal();
  const { address, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const {
    data: allowance,
    status: allowanceStatus,
    refetch: allowanceRefetch
  } = useReadContract({
    abi: erc20Abi,
    address: srcChain ? assets[asset].contracts[srcChain] : null,
    functionName: 'allowance',
    args: [
      address,
      srcChain ? chains[srcChain].contract : null
    ]
  });
  const {
    status: approveStatus,
    reset: approveReset,
    writeContract: approveWriteContract
  } = useWriteContract();
  const {
    status: transferStatus,
    reset: transferReset,
    writeContract: transferWriteContract
  } = useWriteContract();
  
  const bnAmount = new BigNumber(amount).shiftedBy(assets[asset].decimals);
  const bnAllowance = new BigNumber(allowance);
  
  const { signaturesCount, setSignaturesCount } = useState(0);
  const isWaitingForSignatures = true; //(transferStatus == 'success' && signaturesCount < 8);
    
  let submitText;
  let formLocked;
  let submitLocked;
  let submitOnClick;
  
  function approveSrcToken() {
    approveWriteContract({
      address: assets[asset].contracts[srcChain],
      abi: erc20Abi,
      functionName: 'approve',
      args: [
        chains[srcChain].contract,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ]
    });
  };
  
  function transferSrcToken() {
    if(!assets[asset].contracts[srcChain])
      transferWriteContract({
        address: chains[srcChain].contract,
        abi: abiBridge,
        functionName: 'transfer',
        args: [
          dstChain,
          address
        ],
        value: bnAmount
      });
    else
      transferWriteContract({
        address: chains[srcChain].contract,
        abi: abiBridge,
        functionName: 'transferERC20',
        args: [
          assets[asset].contracts[srcChain],
          dstChain,
          address,
          bnAmount
        ]
      });
  };
  
  if(!amount || !srcChain || !dstChain) {
    submitText = 'Continue';
    formLocked = false;
    submitLocked = true;
    submitOnClick = null;
  }
  else if(isConnecting) {
    submitText = (
      <>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Connecting wallet
      </>
    );
    formLocked = false;
    submitLocked = true;
    submitOnClick = null;
  }
  else if(isDisconnected) {
    submitText = 'Connect wallet';
    formLocked = false;
    submitLocked = false;
    submitOnClick = function() { open(); };
  }
  else if(chainId != srcChain) {
    submitText = 'Switch to ' + chains[srcChain].name + ' network';
    formLocked = false;
    submitLocked = false;
    submitOnClick = function() { switchChain({ chainId: srcChain }); };
  }
  else if(transferStatus == 'error') {
    submitText = 'Transfer failed. Retry?';
    formLocked = false;
    submitLocked = false;
    submitOnClick = function() { transferReset(); transferSrcToken() };
  }
  else if(transferStatus == 'pending') {
    submitText = (
      <>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Transferring {asset}
      </>
    );
    formLocked = true;
    submitLocked = true;
    submitOnClick = null;
  }
  else if(isWaitingForSignatures) {
    //
  }
  else if(assets[asset].contracts[srcChain] && approveStatus == 'error') {
    submitText = 'Approve failed. Retry?';
    formLocked = false;
    submitLocked = false;
    submitOnClick = function() { approveReset(); approveSrcToken() };
  }
  else if(assets[asset].contracts[srcChain] && approveStatus == 'pending') {
    submitText = (
      <>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Approving {asset}
      </>
    );
    formLocked = true;
    submitLocked = true;
    submitOnClick = null;
  }
  else if(assets[asset].contracts[srcChain] && allowanceStatus == 'error') {
    submitText = 'Allowance check failed. Retry?';
    formLocked = false;
    submitLocked = false;
    submitOnClick = function() { allowanceRefetch(); };
  }
  else if(assets[asset].contracts[srcChain] && allowanceStatus == 'pending') {
    submitText = (
      <>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Checking allowance
      </>
    );
    formLocked = false;
    submitLocked = true;
    submitOnClick = null;
  }
  else if(assets[asset].contracts[srcChain] && bnAmount > bnAllowance) {
    submitText = 'Approve ' + asset;
    formLocked = false;
    submitLocked = false;
    submitOnClick = approveSrcToken;
  }
  else {
    submitText = 'Transfer ' + asset;
    formLocked = false;
    submitLocked = false;
    submitOnClick = transferSrcToken;
  }

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
          <SelectChain options={srcChainOptions} value={srcChain} onChange={setSrcChain} disabled={formLocked} /> 
        </MDBCol>
        <MDBCol size='auto' className='px-0 my-auto'>
          <MDBBtn block color='secondary' onClick={handleSwapChains} disabled={formLocked} >
            <MDBIcon icon='right-left' />
          </MDBBtn>
        </MDBCol>
        <MDBCol>
          <SelectChain options={dstChainOptions} value={dstChain} onChange={setDstChain} disabled={formLocked} />
        </MDBCol>
      </MDBRow>
      
      {isWaitingForSignatures && (
        <MDBRow className="mb-4">
          <MDBCol>
          </MDBCol>
        </MDBRow>
      )}

      <MDBBtn block disabled={submitLocked} onClick={submitOnClick}>
        {submitText}
      </MDBBtn>
    </>
  );
}

export default TabBridge;
