import {
  MDBIcon,
  MDBTooltip
} from 'mdb-react-ui-kit';
import { useWaku } from "@waku/react";
import { useState, useEffect } from 'react';

import { ReactComponent as SynapseIcon } from '../assets/synapse.svg';
function SynapseStatus() {
  const { node, error, isLoading } = useWaku();
  const { peersCount, setPeersCount } = useState(0);
  
  useEffect(function() {
    if(!node)
      return;
    
    const interval = setInterval(async function() {
      console.log(await node.connectionManager.getPeersByDiscovery());
      setPeersCount(node.relay.gossipSub.getPeers().length);
    }, 1000);
    
    return function() { clearInterval(interval); };
  }, [node]);
  
  let color;
  let tooltip;
  
  if(isLoading) {
    color = 'yellow';
    tooltip = 'Connecting to Synapse...';
  }
  else if(error || !peersCount) {
    color = 'red';
    tooltip = 'Synapse not available';
  }
  else {
    color = 'green';
    tooltip = 'Connected to Synapse network';
  }
  tooltip += ' (' + peersCount + ' peers)';
  
  return (
    <MDBTooltip wrapperProps={{ color: 'secondary' }} title={tooltip}>
      <div style={{ position: 'relative' }}>
        <SynapseIcon height="28" width="auto" />
        <MDBIcon icon='circle' style={{ fontSize: '10px', position: 'absolute', bottom: '-4px', right: '-4px', color }} />
      </div>
    </MDBTooltip>
  );
}

export default SynapseStatus;
