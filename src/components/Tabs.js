import { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBIcon,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import { useAccount } from 'wagmi';

import { chains } from '../configs/Chains';

import TabBridge from './TabBridge';
import TabRetry from './TabRetry';
import TabRelayer from './TabRelayer';
import background from '../assets/background.jpg';

function Tabs() {
  const [tab, setTab] = useState('bridge');
  
  const { status: walletStatus, chainId } = useAccount();
  const connectionGood = (walletStatus != 'connected' || !(chainId in chains));
  
  useEffect(function() {
    if(tab != 'bridge')
      setTab('bridge');
  }, [connectionGood]);

  function handleChangeTab(newTab) {
    if(newTab != tab)
      setTab(newTab);
  };
  
  const className = connectionGood ? '' : 'disabled';

  return (
    <div style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <MDBContainer className='vh-100'>
        <MDBRow className='h-100'>
          <MDBCol xl='8' className='m-auto'>
        <MDBCard border className='my-3'>
          <MDBTabs className='mb-3'>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleChangeTab('bridge')} active={tab === 'bridge'}>
                <MDBIcon fas icon='bridge-water' className='me-2' /> Bridge
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink className={className}  onClick={() => handleChangeTab('retry')} active={tab === 'retry'}>
                <MDBIcon fas icon='clock-rotate-left' className='me-2' /> Retry
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem className='ms-auto'>
              <MDBTabsLink className={className} onClick={() => handleChangeTab('relayer')} active={tab === 'relayer'}>
                <MDBIcon fas icon='user-lock' className='me-2' /> Relayer
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
    
          <MDBTabsContent className='p-3'>
            <MDBTabsPane open={tab === 'bridge'}>
              <TabBridge />
            </MDBTabsPane>
            {connectionGood && (
              <>
                <MDBTabsPane open={tab === 'retry'}>
                  <TabRetry />
                </MDBTabsPane>
                <MDBTabsPane open={tab === 'relayer'}>
                  <TabRelayer />
                </MDBTabsPane>
              </>
            )}
          </MDBTabsContent>
        </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Tabs;