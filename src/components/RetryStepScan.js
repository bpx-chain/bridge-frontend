/* global BigInt */

import { useState, useEffect } from 'react';
import {
  MDBCard,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
  MDBBadge,
  MDBListGroup,
  MDBListGroupItem,
  MDBProgress,
  MDBProgressBar
} from 'mdb-react-ui-kit';
import { getClient } from '@wagmi/core';
import { getLogs } from 'viem/actions';
import { useBlockNumber, useAccount } from 'wagmi';
import {
  parseAbiItem,
  keccak256,
  decodeAbiParameters,
  zeroAddress
} from 'viem';
import BigNumber from 'bignumber.js';
import { useWaku } from "@bpx-chain/synapse-react";
import { createEncoder, utf8ToBytes } from "@bpx-chain/synapse-sdk";

import { chains } from '../configs/Chains';
import { assets } from '../configs/Assets';
import { config } from './WalletProvider';

function RetryStepScan() {
  const homeChainId = 279;
  
  const [progress, setProgress] = useState(0);
  const [allLogs, setAllLogs] = useState([]);
  
  const publicClient = getClient(config);
  const {
    data: latestBlock
  } = useBlockNumber();
  const { address, chainId } = useAccount();
  
  useEffect(function() {
    if(!latestBlock || progress)
      return;
    
    setProgress(1);
    
    async function fetcher() {
      let endBlock = latestBlock;
      let startBlock = latestBlock - 999n;
      
      do {
        const logs = await getLogs(publicClient, {
          address: chains[chainId].contract,
          event: parseAbiItem('event MessageCreated(uint256 indexed chainId, address indexed from, bytes message)'),
          args: {
            from: address
          },
          fromBlock: startBlock,
          toBlock: endBlock
        });
        
        if(logs.length)
          setAllLogs(allLogs.concat(logs));
        
        setProgress(Math.floor(
          parseInt(latestBlock - startBlock) / chains[chainId].retryBlocks * 100
        ));
        
        endBlock -= 1000n;
        startBlock -= 1000n;
      } while(latestBlock - startBlock < chains[chainId].retryBlocks);
      
      setProgress(100);
    }
    
    fetcher();
  }, [latestBlock]);
  
  function decodeMessage(message) {
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
      srcChainId: decodedMessage[0],
      dstChainId: decodedMessage[1],
      asset: asset,
      dstAddress: decodedMessage[5],
      value: decodedMessage[6]
    };
  };
  
  const {
    node: synapse,
    error: synapseError,
    isLoading: synapseIsLoading
  } = useWaku();
  const [retryMsg, setRetryMsg] = useState(null);
  const [retryProgress, setRetryProgress] = useState(0);
  
  async function retryBridge(log) {
    setRetryProgress(0);
    setRetryMsg(log.args.message);
    
    const decodedMessage = decodeMessage(log.args.message);
    const messageHash = keccak256(log.args.message);
    
    return;
    
    try {
      const contentTopic = '/bridge/1/retry-' + decodedMessage.srcChainId + '-' +
        decodedMessage.dstChainId + '-' + address.toLowerCase() + '/json';
      const encoder = createEncoder({ contentTopic });
      
      const request = {
        from: address,
        message: log.args.message,
        txid: log.transactionHash
      };
      
      await synapse.lightPush.send(encoder, {
        payload: utf8ToBytes(JSON.stringify(request))
      });
    }
    catch(e) {
      console.log(e);
    }
  };
  
  return (
    <>
      {progress < 100 ? (
        <MDBCard border className='p-2 mb-4' style={{ backgroundColor: '#ececec' }}>
          <MDBRow className='mb-2'>
            <MDBCol size='auto' className='my-auto ms-auto'>
              <MDBIcon icon='circle-notch' spin />
            </MDBCol>
            <MDBCol size='auto' className='my-auto me-auto'>
              Loading transactions...
            </MDBCol>
          </MDBRow>
          <MDBProgress style={{ backgroundColor: 'white' }}>
            <MDBProgressBar width={progress} valuemin={0} valuemax={100} />
          </MDBProgress>
        </MDBCard>
      ) : allLogs.length == 0 ? (
        <MDBCard border className='p-2'>
          <MDBRow>
            <MDBCol size='auto' className='mx-auto'>
              No transactions
            </MDBCol>
          </MDBRow>
        </MDBCard>
      ) : (
        <MDBListGroup style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          {allLogs.map(function(log) {
            const msg = decodeMessage(log.args.message);
            const value = new BigNumber(msg.value).shiftedBy(-assets[msg.asset].decimals).toFormat(
              null,
              null,
              {
                prefix: '',
                decimalSeparator: '.',
                groupSeparator: ',',
                groupSize: 3,
                secondaryGroupSize: 0,
                fractionGroupSeparator: '',
                fractionGroupSize: 0,
                suffix: ''
              }
            );
            
            return (
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <img
                    src={assets[msg.asset].icon}
                    style={{ width: '45px', height: '45px' }}
                  />
                  <div className='ms-3' style={{ fontSize: '12px' }}>
                    <p className='fw-bold mb-1'>Transfer {value} {msg.asset}</p>
                    <p className='text-muted mb-0'>
                      {chains[chainId].name}
                      <MDBIcon icon='arrow-right' className='mx-2' />
                      {chains[log.args.chainId].name}
                    </p>
                  </div>
                </div>
                <MDBBtn
                 size='sm'
                 rounded
                 color='link'
                 onClick={() => { retryBridge(log)} }
                 disabled={retryMsg !== null || synapseError || synapseIsLoading}
                >
                  {retryMsg == log.args.message ? (
                    <>
                      <MDBIcon icon='circle-notch' spin className='me-1' />
                      {retryProgress}/8
                    </>
                  ) : 'Retry'}
                </MDBBtn>
              </MDBListGroupItem>
            );
        })}
        </MDBListGroup>
      )}
    </>
  );
}

export default RetryStepScan;
