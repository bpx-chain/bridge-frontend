import { useState, useEffect } from 'react';
import {
  MDBCard,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBProgress,
  MDBProgressBar
} from 'mdb-react-ui-kit';
import { getClient } from '@wagmi/core';
import { getLogs } from 'viem/actions';
import { useBlockNumber, useAccount } from 'wagmi';
import { parseAbiItem } from 'viem';

import { chains } from '../configs/chains';
import { assets } from '../configs/assets';
import { homeChainId } from '../configs/homeChainId';
import { config } from './WalletProvider';

import decodeMessage from '../utils/decodeMessage';

function RetryStepScan(props) {
  const {
    setMessage
  } = props;
  
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
    
    async function fetchLogs() {
      let endBlock = latestBlock;
      let startBlock = latestBlock - 999n;
      
      do {
        try {
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
            setAllLogs(prevState => prevState.concat(logs));
          
          setProgress(Math.floor(
            parseInt(latestBlock - startBlock) / chains[chainId].retryBlocks * 100
          ));
          
          endBlock -= 1000n;
          startBlock -= 1000n;
        }
        catch(e) {
          await new Promise(r => setTimeout(r, 3000));
        }
      } while(latestBlock - startBlock < chains[chainId].retryBlocks);
      
      setProgress(100);
    };
    
    fetchLogs();
  }, [latestBlock]);
  
  return (
    <>
      {progress < 100 && (
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
      )}
      {progress == 100 && allLogs.length == 0 && (
        <MDBCard border className='p-2'>
          <MDBRow>
            <MDBCol size='auto' className='mx-auto'>
              No transactions
            </MDBCol>
          </MDBRow>
        </MDBCard>
      )}
      {allLogs.length > 0 && (
        <MDBListGroup style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          {allLogs.map(function(log) {
            const decodedMessage = decodeMessage(log);
            const value = decodedMessage.value.shiftedBy(-assets[decodedMessage.asset].decimals).toFormat(
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
              <MDBListGroupItem
               key={decodedMessage.messageHash}
               className='d-flex justify-content-between align-items-center'
              >
                <div className='d-flex align-items-center'>
                  <img
                    src={assets[decodedMessage.asset].icon}
                    style={{ width: '45px', height: '45px' }}
                  />
                  <div className='ms-3' style={{ fontSize: '12px' }}>
                    <p className='fw-bold mb-1'>Transfer {value} {decodedMessage.asset}</p>
                    <p className='text-muted mb-0'>
                      {chains[decodedMessage.srcChainId].name}
                      <MDBIcon icon='arrow-right' className='mx-2' />
                      {chains[decodedMessage.dstChainId].name}
                    </p>
                  </div>
                </div>
                <MDBBtn
                 size='sm'
                 rounded
                 color='link'
                 onClick={() => { setMessage(decodedMessage); }}
                >
                  Retry
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
