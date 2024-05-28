import { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBCard
} from 'mdb-react-ui-kit';
import { useBlock, useReadContract } from 'wagmi';
import { keccak256 } from 'viem';
import BigNumber from 'bignumber.js';
import { useWaku, useFilterMessages, useStoreMessages } from "@bpx-chain/synapse-react";
import { Decoder } from "@bpx-chain/synapse-sdk";

import { pubSubTopic } from './SynapseProvider';
import { chains } from '../configs/Chains';
import { abiBridge } from '../configs/AbiBridge';

function BridgeStepSignatures(props) {
  const {
    data: latestBlock,
    status: latestBlockStatus
  } = useBlock({
    blockTag: 'latest',
    watch: true
  });
  
  const messageHash = keccak256(props.message);
  const epoch = (latestBlockStatus == 'success')
    ? new BigNumber(latestBlock.timestamp).div(60).div(20).dp(0, BigNumber.ROUND_DOWN)
    : null;
  
  const {
    data: relayers,
    status: getRelayersStatus,
    error: error
  } = useReadContract({
    abi: abiBridge,
    address: chains[props.dstChain].contract,
    functionName: 'messageGetRelayers',
    args: [
      props.srcChain,
      messageHash,
      epoch
    ]
  });
  
  const [ cursor, setCursor ] = useState(null);
  const [ signatures, setSignatures ] = useState([]);
  
  const contentTopic = '/bridge/1/client-' + props.address.toLowerCase() + '/json';
  const decoder = new Decoder(pubSubTopic, contentTopic);
  
  const { node } = useWaku();
  const { messages: storeMessages, error: storeError } = useStoreMessages({
    node,
    decoder,
    options: {
      cursor,
      pageDirection: "forward"
    }
  });
  const { messages: filterMessages, error: filterError } = useFilterMessages({ node, decoder });
  console.log(storeMessages);
  console.log(filterMessages);
  
  useEffect(function() {
    if(storeMessages.length)
      setCursor(storeMessages[storeMessages.length-1]);
    
    const allMessages = storeMessages.concat(filterMessages);
    /*setMessages(allMessages.map((wakuMessage) => {
      if (!wakuMessage.payload) return;
      return ChatMessage.decode(wakuMessage.payload);
    })*/
  }, [filterMessages, storeMessages]);
  
  return (
    <>
      <MDBCard border className='p-2 mb-4' style={{ backgroundColor: '#ececec' }}>
        {(latestBlockStatus == 'success' && getRelayersStatus == 'success') ? (
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