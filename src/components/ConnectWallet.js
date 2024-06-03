import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useSwitchChain } from 'wagmi';

import { assets } from '../configs/assets';
import { chains } from '../configs/chains';

function ConnectWallet(props) {
  const {
    requiredChain,
    children
  } = props;
  
  const { open } = useWeb3Modal();
  const { chainId, status } = useAccount();
  const { switchChain } = useSwitchChain();
  
  function switchToRequiredChain() {
    switchChain({ chainId: requiredChain });
  };
  
  if(status == 'connecting' || status == 'reconnecting')
    return (
      <MDBBtn block disabled>
        <MDBIcon icon='circle-notch' spin className='me-2' />
        Connecting wallet...
      </MDBBtn>
    );
  else if(status == 'disconnected')
    return (
      <MDBBtn block onClick={open}>
        Connect wallet
      </MDBBtn>
    );
  else if(status == 'connected' && chainId != requiredChain)
    return (
      <MDBBtn block onClick={switchToRequiredChain}>
        Switch to {chains[requiredChain].name} network
      </MDBBtn>
    );

  else return children;
}

export default ConnectWallet;
