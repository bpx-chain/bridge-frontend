import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useAccount, useWriteContract } from 'wagmi';

import { chains } from '../configs/chains';
import { abiBridge } from '../configs/abiBridge';

import MsgBox from './MsgBox';

function RelayerCmdDeactivate(props) {
  const { address, chainId } = useAccount();
  const { oppChain } = props;
  
  const {
    writeContract,
    status: writeContractStatus,
    error: writeContractError
  } = useWriteContract();
  
  function submit() {
    writeContract({
      address: chains[chainId].contract,
      abi: abiBridge,
      functionName: 'relayerDeactivate',
      args: [
        oppChain
      ],
      value: props.amountWei
    });
  };
  
  return (
    <>
      {writeContractError && (
        <MsgBox title='Error'>
          {writeContractError.shortMessage}
        </MsgBox>
      )}
      <MDBCard border className='p-3'>
        <MDBRow>
          <MDBCol>
            <small><strong><u>Deactivate a relayer</u></strong></small>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol size='9'>
            <small>
              <ul>
                <li>
                  This command deactivates your wallet address as a relayer for transactions coming
                  from <strong>{chains[oppChain].name}</strong> to <strong>{chains[chainId].name}</strong>.
                </li>
                <li>
                  You will be able to withdraw your relayer stake after <strong>2 epochs</strong> (40 minutes).
                </li>
              </ul>
            </small>
          </MDBCol>
          <MDBCol size='3' className='my-auto'>
            <MDBBtn block onClick={submit} disabled={writeContractStatus == 'pending'}>
              {writeContractStatus == 'pending' ? (
                <MDBIcon icon='circle-notch' spin />
              ) : 'Submit'}
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </>
  );
}

export default RelayerCmdDeactivate;
