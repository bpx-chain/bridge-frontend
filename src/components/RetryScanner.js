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
import { parseAbiItem } from 'viem';

import { chains } from '../configs/Chains';

import { config } from './WalletProvider';

function RetryScanner() {
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
  
  console.log(allLogs);
  
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
          {allLogs.map((log) => (
            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
              <div className='d-flex align-items-center'>
                <img
                  src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                  alt=''
                  style={{ width: '45px', height: '45px' }}
                  className='rounded-circle'
                />
                <div className='ms-3'>
                  <p className='fw-bold mb-1'>John Doe</p>
                  <p className='text-muted mb-0'>john.doe@gmail.com</p>
                </div>
              </div>
              <MDBBtn size='sm' rounded color='link'>
                View
              </MDBBtn>
            </MDBListGroupItem>
          ))}
        </MDBListGroup>
      )}
    </>
  );
}

export default RetryScanner;
