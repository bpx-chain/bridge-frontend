import { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBRow
} from 'mdb-react-ui-kit';
import { useAccount, useReadContract } from 'wagmi';

import { chains } from '../configs/Chains';
import { abiBridge } from '../configs/AbiBridge';

import SelectChain from './SelectChain';
import RelayerStatus from './RelayerStatus';
import RelayerCmdActivate from './RelayerCmdActivate';

function TabRelayer() {
  const homeChainId = 279;
  
  const { address, chainId } = useAccount();
  
  let oppChains;
  if(chainId == homeChainId) {
    oppChains = Object.assign({}, chains);
    for(const ch in oppChains)
      if(ch == chainId)
        delete oppChains[ch];
  }
  else {
    oppChains = {};
    oppChains[homeChainId] = chains[homeChainId];
  }
  
  const [oppChain, setOppChain] = useState(Object.keys(oppChains)[0]);
  useEffect(function() {
    setOppChain(Object.keys(oppChains)[0]);
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
  
  return (
    <>
      <MDBRow>
        <MDBCol>
          Source chain:
        </MDBCol>
        <MDBCol>
          <SelectChain options={oppChains} value={oppChain} onChange={setOppChain} />
        </MDBCol>
      </MDBRow>
      
      <RelayerStatus relayerStatus={relayerStatus} relayerGetStatusStatus={relayerGetStatusStatus} />
      
      {relayerGetStatusStatus == 'success' && (
        <>
          <div className='mt-4'>
            <h5>Relayer commands:</h5>
          </div>
          
          {!relayerStatus[0] && (
            <RelayerCmdActivate oppChain={oppChain} />
          )}
        </>
      )}
    </>
  );
}

export default TabRelayer;
