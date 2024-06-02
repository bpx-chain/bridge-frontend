import { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBCard
} from 'mdb-react-ui-kit';
import {
  useAccount,
  useBlock
} from 'wagmi';
import {
  getClient,
  readContract
} from '@wagmi/core';
import { keccak256 } from 'viem';
import BigNumber from 'bignumber.js';
import {
  useWaku,
  useFilterMessages,
  useStoreMessages
} from "@bpx-chain/synapse-react";
import { createDecoder } from "@bpx-chain/synapse-sdk";

import { pubSubTopic } from './SynapseProvider';
import { chains } from '../configs/Chains';
import { abiBridge } from '../configs/AbiBridge';
import { config } from './WalletProvider';

function BridgeStepSignatures(props) {
  const {
    srcChain,
    message
  } = props;
  
  const {
    address,
    chainId
  } = useAccount();
  const {
    data: latestBlock
  } = useBlock({
    blockTag: 'latest',
    watch: true
  });
  const publicClient = getClient(config);
  
  const [epoch, setEpoch] = useState(null);
  
  useEffect(function() {
    if(!latestBlock)
      return;
    
    const newEpoch = new BigNumber(latestBlock.timestamp).div(60).div(20).dp(0, BigNumber.ROUND_DOWN);
    
    if(epoch != newEpoch)
      setEpoch(newEpoch);
  }, [latestBlock]);

  const messageHash = keccak256(message);
  const [relayers, setRelayers] = useState([]);
  const [signatures, setSignatures] = useState([]);
  
  useEffect(function() {
    if(!epoch)
      return;
    
    async function getRelayersOnEpochChange() {
      try {
        setRelayers(
          await readContract(config, {
            abi: abiBridge,
            address: chains[chainId].contract,
            functionName: 'messageGetRelayers',
            args: [
              srcChain,
              messageHash,
              epoch
            ]
          })
        );
      }
      catch(e) {
        setTimeout(getRelayersOnEpochChange, 3000);
        setRelayers([]);
      }
      setSignatures([null, null, null, null, null, null, null, null]);
    };
    
    getRelayersOnEpochChange();
  }, [epoch]);
  
  const contentTopic = '/bridge/1/client-' + address.toLowerCase() + '/json';
  const decoder = createDecoder(contentTopic, pubSubTopic);
  const { node: synapse } = useWaku();
  const [ cursor, setCursor ] = useState(null);
  const { messages: storeMessages } = useStoreMessages({
    node: synapse,
    decoder,
    options: {
      cursor,
      pageDirection: "forward"
    }
  });
  const { messages: filterMessages } = useFilterMessages({ node: synapse, decoder });
  
  useEffect(function() {
    if(storeMessages.length)
      setCursor(storeMessages[storeMessages.length-1]);
    
    let tmpMessages = [];
    for(const rawMsg of storeMessages.concat(filterMessages)) {
      if(!rawMsg.payload)
        continue;
    
      let msg;
      try {
        msg = JSON.parse(new TextDecoder().decode(rawMsg.payload));
      } catch(e) {
        continue;
      }
    
      if(typeof msg.messageHash != 'string' || msg.messageHash != messageHash)
        continue;
      
      if(typeof msg.epoch != 'number' || !Number.isInteger(msg.epoch) || msg.epoch < 1)
        continue;
      
      if(typeof msg.v != 'number' || !Number.isInteger(msg.v) || msg.v < 0)
        continue;
      
      if(typeof msg.r != 'string' || !msg.r.match(/^0x[0-9a-f]{64}$/))
        continue;
      
      if(typeof msg.s != 'string' || !msg.s.match(/^0x[0-9a-f]{64}$/))
        continue;
        
      tmpMessages.push(msg);
      console.log(tmpMessages);
    }
  }, [filterMessages, storeMessages]);
  
  return (
    <>
      <MDBCard border className='p-2 mb-4' style={{ backgroundColor: '#ececec' }}>
        {(relayers.length == 8) ? (
          <>
            <MDBRow>
              <MDBCol>
                <small><strong>Relayers delegated to sign a cross-chain message:</strong></small>
              </MDBCol>
            </MDBRow>
            {relayers.map(function(relayer) {
              return (
                <MDBRow>
                  <MDBCol size='auto' className='my-auto'>
                    <MDBIcon icon='circle-notch' spin className='ms-3' />
                  </MDBCol>
                  <MDBCol className='my-auto py-1'>
                    {relayer}
                  </MDBCol>
                </MDBRow>
              );
            })}
            <hr />
            <MDBRow>
              <MDBCol>
                <small>
                  <strong>Message hash:</strong>
                  <br />
                  {messageHash}
                </small>
              </MDBCol>
              <MDBCol>
                <small>
                  <strong>Epoch:</strong>
                  <br />
                  {epoch.toString()}
                </small>
              </MDBCol>
            </MDBRow>
          </>
        ) : (
          <MDBRow>
            <MDBCol size='auto' className='m-auto'>
              <MDBIcon icon='circle-notch' spin />
            </MDBCol>
          </MDBRow>
        )}
      </MDBCard>
      
      <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Waiting for signatures... ({signatures.length}/8)
      </MDBBtn>
    </>
  );
}

export default BridgeStepSignatures;