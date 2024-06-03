import { useState } from 'react';
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
  MDBCol,
  MDBBtn
} from 'mdb-react-ui-kit';

import TabBridge from './TabBridge';
import TabRetry from './TabRetry';
import TabRelayer from './TabRelayer';
import background from '../assets/background.jpg';

function Tabs() {
  const [tab, setTab] = useState('bridge');
  
  function handleChangeTab(newTab) {
    if(newTab != tab)
      setTab(newTab);
  };
  
  const [resetNonce, setResetNonce] = useState(0);
  
  function startOver() {
    setResetNonce(resetNonce+1);
  };

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
                  <MDBTabsLink onClick={() => handleChangeTab('retry')} active={tab === 'retry'}>
                    <MDBIcon fas icon='clock-rotate-left' className='me-2' /> Retry
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem className='ms-auto'>
                  <MDBTabsLink onClick={() => handleChangeTab('relayer')} active={tab === 'relayer'}>
                    <MDBIcon fas icon='user-lock' className='me-2' /> Relayer
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs>
        
              <MDBTabsContent className='p-3'>
                <MDBTabsPane key={resetNonce} open>
                  {tab === 'bridge' ? (
                    <TabBridge />
                  ) : tab === 'retry' ? (
                    <TabRetry />
                  ) : ( 
                    <TabRelayer />
                  )}
                  
                  {tab !== 'relayer' && (
                    <MDBBtn block color='secondary' className='mt-2' onClick={startOver}>
                      <MDBIcon fas icon='rotate-left' className='me-2' />
                      Start over
                    </MDBBtn>
                  )}
                </MDBTabsPane>
              </MDBTabsContent>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Tabs;