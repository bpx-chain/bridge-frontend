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
  readContract
} from '@wagmi/core';
import {
  encodePacked,
  keccak256,
  recoverMessageAddress
} from 'viem';
import BigNumber from 'bignumber.js';
import {
  useWaku
} from "@bpx-chain/synapse-react";
import {
  createEncoder,
  createDecoder,
  utf8ToBytes
} from "@bpx-chain/synapse-sdk";

import { pubsubTopic } from './SynapseProvider';
import { chains } from '../configs/chains';
import { abiBridge } from '../configs/abiBridge';
import { config } from './WalletProvider';

import BridgeStepProcessMessage from './BridgeStepProcessMessage';

BigNumber.set({EXPONENTIAL_AT: 25});

function BridgeStepSignatures(props) {
  const {
    message,
    requestRetry
  } = props;
  
  const {
    address,
    chainId
  } = useAccount();
  
  // BLOCK
  
  const {
    data: latestBlock
  } = useBlock({
    blockTag: 'latest',
    watch: true
  });
  
  // EPOCH <- BLOCK
  
  const [epoch, setEpoch] = useState(null);
  const [freeze, setFreeze] = useState(false);
  
  useEffect(function() {
    if(!latestBlock || freeze)
      return;
    
    const newEpoch = new BigNumber(latestBlock.timestamp).div(60).div(20).dp(0, BigNumber.ROUND_DOWN);
    
    if(!newEpoch.eq(epoch))
      setEpoch(newEpoch);
  }, [latestBlock, freeze]);
  
  function handleFreeze(newValue) {
    if(newValue != freeze)
      setFreeze(newValue);
  };
  
  // RELAYERS <- EPOCH

  const [relayers, setRelayers] = useState([]);
  
  useEffect(function() {
    if(!epoch)
      return;
    
    setRelayers([]);
    
    async function getRelayersOnEpochChange() {
      try {
        setRelayers(
          await readContract(config, {
            abi: abiBridge,
            address: chains[chainId].contract,
            functionName: 'messageGetRelayers',
            args: [
              message.srcChainId,
              message.messageHash,
              epoch
            ]
          })
        );
      }
      catch(e) {
        setTimeout(getRelayersOnEpochChange, 3000);
      }
    };
    
    getRelayersOnEpochChange();
  }, [epoch]);
  
  // ALL SIGNATURES <- MESSAGE
  
  const [allSignatures, setAllSignatures] = useState([]);
  
  async function onMsg(rawMsg) {
    if(!rawMsg.payload)
      return;
  
    let msg;
    try {
      msg = JSON.parse(new TextDecoder().decode(rawMsg.payload));
    } catch(e) {
      return;
    }
  
    if(typeof msg.messageHash != 'string' || msg.messageHash != message.messageHash)
      return;
    
    if(typeof msg.epoch != 'number' || !Number.isInteger(msg.epoch) || msg.epoch < 1)
      return;
    
    if(typeof msg.v != 'number' || !Number.isInteger(msg.v) || msg.v < 0)
      return;
    
    if(typeof msg.r != 'string' || !msg.r.match(/^0x[0-9a-f]{64}$/))
      return;
    
    if(typeof msg.s != 'string' || !msg.s.match(/^0x[0-9a-f]{64}$/))
      return;
    
    const signature = { r: msg.r, s: msg.s, v: msg.v };
    const epochHash = keccak256(encodePacked(
      ['bytes32', 'uint64'],
      [msg.messageHash, msg.epoch]
    ));
    
    let recoveredAddr;
    try {
      recoveredAddr = await recoverMessageAddress({
        message: { raw: epochHash },
        signature
      });
    }
    catch(e) {
      return;
    }
    
    setAllSignatures(prevState => [
      {
        epoch: msg.epoch,
        relayer: recoveredAddr,
        signature: signature
      },
      ...prevState
    ]);
  };
  
  const { node: synapse } = useWaku();
  
  useEffect(function() {
    const contentTopic = '/bridge/1/client-' + address.toLowerCase() + '/json';
    const decoder = createDecoder(contentTopic, pubsubTopic);
    
    async function startFilterAndStore() {
      while(true) {
        try {
          await synapse.filter.subscribe(
            [decoder],
            onMsg
          );
          break;
        }
        catch(e) {
          console.log(e);
          await new Promise(r => setTimeout(r, 3000));
        }
      }
      while(true) {
        try {
          await synapse.store.queryWithOrderedCallback(
            [decoder],
            onMsg
          );
          break;
        }
        catch(e) {
          await new Promise(r => setTimeout(r, 3000));
        }
      }
    };
    
    startFilterAndStore();
  }, [synapse]);
  
  // SIGNATURES <- RELAYERS + ALL SIGNATURES
  
  const [signatures, setSignatures] = useState([]);
  
  useEffect(function() {
    let tmpSignatures = [null, null, null, null, null, null, null, null];
    
    for(const sig of allSignatures) {
      if(sig.epoch != epoch)
        continue;
    
      const relayerIndex = relayers.indexOf(sig.relayer);
      if(relayerIndex == -1)
        continue;
    
      tmpSignatures[relayerIndex] = sig.signature;
    }
    
    setSignatures(tmpSignatures);
  }, [relayers, allSignatures]);
  
  // RR PROGRESS <- RELAYERS
  
  const [rrProgress, setRrProgress] = useState(null);
  
  useEffect(function() {
    if(relayers.length != 8 || !requestRetry)
      return;
    
    setRrProgress(0);
    
    const payload = utf8ToBytes(JSON.stringify({
      messageHash: message.messageHash,
      epoch: epoch.toNumber()
    }));
    
    async function sendRetryRequests(index) {
      const contentTopic = '/bridge/1/retry-' + message.srcChainId + '-' +
        message.dstChainId + '-' + relayers[index].toLowerCase() + '/json';
      const encoder = createEncoder({ contentTopic, pubsubTopic });
      
      const result = await synapse.lightPush.send(encoder, { payload });
      
      if(!result.successes.length)
        setTimeout(function() {
          sendRetryRequests(index);
        }, 3000);
      else if(index == 7)
        setRrProgress(null);
      else {
        setRrProgress(index + 1);
        sendRetryRequests(index + 1);
      }
    };
    
    sendRetryRequests(0);
  }, [relayers]);
  
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
            {relayers.map(function(relayer, index) {
              return (
                <MDBRow key={index}>
                  <MDBCol size='auto' className='my-auto'>
                    {signatures[index] === null ? (
                      <MDBIcon icon='circle-notch' spin className='ms-3' />
                    ) : (
                      <MDBIcon icon='circle-check' color='success' className='ms-3' />
                    )}
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
                  {message.messageHash}
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
      
      {(signatures.length != 8 || signatures.indexOf(null) != -1) ? (
        <MDBBtn block disabled>
          <MDBIcon icon='circle-notch' spin className='me-2' />
          {rrProgress !== null ? (
            <>
              Requesting retry... ({rrProgress}/8)
            </>
          ) : (
            <>
              Waiting for signatures... ({signatures.filter(x => x !== null).length}/8)
            </>
          )}
        </MDBBtn>
      ) : (
        <BridgeStepProcessMessage
         signatures={signatures}
         epoch={epoch}
         handleFreeze={handleFreeze}
         {...props}
        />
      )}
    </>
  );
}

export default BridgeStepSignatures;