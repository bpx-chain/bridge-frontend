import { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBRow
} from 'mdb-react-ui-kit';
import { useAccount, useReadContract } from 'wagmi';

import { chains } from '../configs/chains';
import { abiBridge } from '../configs/abiBridge';
import { homeChainId } from '../configs/homeChainId';

import SelectChain from './SelectChain';
import RelayerStatus from './RelayerStatus';
import RelayerCmdActivate from './RelayerCmdActivate';
import RelayerCmdDeactivate from './RelayerCmdDeactivate';
import RelayerCmdWithdraw from './RelayerCmdWithdraw';

function TabRelayer() {
  const { address, chainId } = useAccount();
  
  function createOppChains() {
    let tmpOppChains;
    if(chainId == homeChainId) {
      tmpOppChains = Object.assign({}, chains);
      for(const ch in tmpOppChains)
        if(ch == chainId)
          delete tmpOppChains[ch];
    }
    else {
      tmpOppChains = {};
      tmpOppChains[homeChainId] = chains[homeChainId];
    }
    return tmpOppChains;
  };
  
  const [oppChains, setOppChains] = useState(createOppChains());
  const [oppChain, setOppChain] = useState(Object.keys(oppChains)[0]);
  useEffect(function() {
    let tmpOppChains = createOppChains();
    setOppChains(tmpOppChains);
    setOppChain(Object.keys(tmpOppChains)[0]);
  }, [chainId]);
  
  const {
    data: relayerStatus,
    status: relayerGetStatusStatus
  } = useReadContract({
    abi: abiBridge,
    address: chains[chainId].contract,
    functionName: 'relayerGetStatus',
    args: [
      oppChain,
      address
    ]
  });
  
  const {
    data: balance,
    status: relayerGetBalanceStatus
  } = useReadContract({
    abi: abiBridge,
    address: chains[chainId].contract,
    functionName: 'relayerGetBalance',
    args: [
      oppChain,
      address
    ]
  });
  
  const {
    data: withdrawalMax,
    status: relayerGetWithdrawalMaxStatus
  } = useReadContract({
    abi: abiBridge,
    address: chains[chainId].contract,
    functionName: 'relayerGetWithdrawalMax',
    args: [
      oppChain,
      address
    ]
  });
  
  return (
    <>
      <MDBRow>
        <MDBCol className='my-auto'>
          Opposite chain:
        </MDBCol>
        <MDBCol>
          <SelectChain options={oppChains} value={oppChain} onChange={setOppChain} />
        </MDBCol>
      </MDBRow>
      
      <RelayerStatus
       relayerStatus={relayerStatus}
       relayerGetStatusStatus={relayerGetStatusStatus}
       balance={balance}
       relayerGetBalanceStatus={relayerGetBalanceStatus}
       withdrawalMax={withdrawalMax}
       relayerGetWithdrawalMaxStatus={relayerGetWithdrawalMaxStatus}
      />
      
      {relayerGetStatusStatus == 'success' && (
        <>
          <div className='mt-4'>
            <h5>Relayer commands:</h5>
          </div>
          
          {!relayerStatus[0] ? (
            <RelayerCmdActivate oppChain={oppChain} />
          ) : (
            <RelayerCmdDeactivate oppChain={oppChain} />
          )}
        </>
      )}
      <RelayerCmdWithdraw
       oppChain={oppChain}
       withdrawalMax={withdrawalMax}
       relayerGetWithdrawalMaxStatus={relayerGetWithdrawalMaxStatus}
      />
    </>
  );
}

export default TabRelayer;
