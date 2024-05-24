import React, { useState } from 'react';
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

import TabBridge from './TabBridge';
import TabRetry from './TabRetry';
import TabRelayer from './TabRelayer';
import background from '../assets/background.jpg';

function Tabs() {
  const [iconsActive, setIconsActive] = useState('tab1');

  const handleIconsClick = (value: string) => {
    if (value === iconsActive) {
      return;
    }

    setIconsActive(value);
  };

  return (
    <div style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <MDBContainer className='vh-100'>
        <MDBRow className='h-100'>
          <MDBCol xl='8' className='m-auto'>
        <MDBCard border className='my-3'>
          <MDBTabs className='mb-3'>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleIconsClick('tab1')} active={iconsActive === 'tab1'}>
                <MDBIcon fas icon='bridge-water' className='me-2' /> Bridge
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleIconsClick('tab2')} active={iconsActive === 'tab2'}>
                <MDBIcon fas icon='clock-rotate-left' className='me-2' /> Retry
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem className='ms-auto'>
              <MDBTabsLink onClick={() => handleIconsClick('tab3')} active={iconsActive === 'tab3'}>
                <MDBIcon fas icon='user-lock' className='me-2' /> Relayer
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
    
          <MDBTabsContent className='p-3'>
            <MDBTabsPane open={iconsActive === 'tab1'}>
              <TabBridge />
            </MDBTabsPane>
            <MDBTabsPane open={iconsActive === 'tab2'}>
              <TabRetry />
            </MDBTabsPane>
            <MDBTabsPane open={iconsActive === 'tab3'}>
              <TabRelayer />
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