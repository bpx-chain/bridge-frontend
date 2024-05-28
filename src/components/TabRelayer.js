import { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';
import { useAccount, useReadContract } from 'wagmi';

import { chains } from '../configs/Chains';
import { abiBridge } from '../configs/AbiBridge';

import SelectChain from './SelectChain';

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
  
  return relayerGetStatusStatus == 'success' ? (
    <>
      <MDBRow>
        <MDBCol>
          Source chain:
        </MDBCol>
        <MDBCol>
          <SelectChain options={oppChains} value={oppChain} onChange={setOppChain} />
        </MDBCol>
      </MDBRow>
      
      <MDBCard border className='p-2 mt-4' style={{ backgroundColor: '#ececec' }}>
        <MDBRow>
          <MDBCol size='auto' className='my-auto'>
            <MDBIcon icon='circle' color='success' className='p-3 fa-2xl' />
          </MDBCol>
          <MDBCol>
            <small>
              <MDBRow>
                <MDBCol size='6'>
                  <strong>Destination chain:</strong>
                  <br />
                  <img src={chains[chainId].icon} width="16" height="16" className="me-1" />
                  {chains[chainId].name}
                </MDBCol>
                <MDBCol size='6'>
                  <strong>Wallet:</strong>
                  <br />
                  {address}
                </MDBCol>
              </MDBRow>
              <MDBRow className='mt-2'>
                <MDBCol size='6'>
                  <strong>Relayer status:</strong>
                  <br />
                  {relayerStatus[0] ? 'Active' : 'Inactive'}
                </MDBCol>
                <MDBCol size='6'>
                  <strong>{relayerStatus[0] ? 'Activation' : 'Deactivation'} epoch:</strong>
                  <br />
                  {parseInt(relayerStatus[1])}
                </MDBCol>
              </MDBRow>
            </small>
          </MDBCol>
        </MDBRow>
      </MDBCard>
      
      <div className='mt-4'>
        <h5>Relayer commands:</h5>
      </div>
      
      <MDBCard border className='p-3'>
        <MDBRow>
          <MDBCol size='9'>
            <small>
              <div>
                <strong>Activate a relayer:</strong>
              </div>
              <div className='mt-2'>
                ......
              </div>
            </small>
          </MDBCol>
          <MDBCol size='3' className='my-auto'>
            <MDBBtn block disabled>
              Submit
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </>
  ) : (
    <>
    </>
  );
}

export default TabRelayer;
