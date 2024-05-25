import {useState} from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit';
import Select from 'react-select';
import { assets } from '../configs/Assets';
import { chains } from '../configs/Chains';

function TabBridge() {
    let assetOptions = [];
    for(const [k, v] of Object.entries(assets))
        assetOptions.push({
            value: k,
            label: (
                <>
                    <img src={v.icon} width="16" height="16" class="me-2" />
                    {v.name} ({k})
                </>
            )
        });

    const [asset, setAsset] = useState(assetOptions[0]);
    const [amount, setAmount] = useState('');
    
    function handleChangeAsset(newValue) {
        setAsset(newValue);
        setAmount('');
        setSrcChain(null);
        setDstChain(null);
    };
    
    function handleChangeAmount(e) {
        const regexp = new RegExp('^[0-9]{1,}(\.[0-9]{0,' + assets[asset.value].decimals + '})?$');
        if (e.target.value === '' || regexp.test(e.target.value))
            setAmount(e.target.value);
        else
            setAmount(amount);
    };
    
    let chainOptions = [];
    for(const [k, v] of Object.entries(chains))
        if(k in assets[asset.value].contracts)
            chainOptions.push({
                value: k,
                label: (
                    <>
                        <img src={v.icon} width="16" height="16" class="me-2" />
                        {v.name}
                    </>
                )
            });
    
    const [srcChain, setSrcChain] = useState(null);
    const [dstChain, setDstChain] = useState(null);
    
    const srcChainOptions = chainOptions.filter(function(item) {
        return !dstChain || item.value != dstChain.value;
    });
    
    const dstChainOptions = chainOptions.filter(function(item) {
        return !srcChain || item.value != srcChain.value;
    });
    
    function handleChangeSrcChain(newValue) {
        setSrcChain(newValue);
    };
    
    function handleChangeDstChain(newValue) {
        setDstChain(newValue);
    };
    
    function handleSwapChains() {
        setSrcChain(dstChain);
        setDstChain(srcChain);
    }
  
    return (
        <>
            <MDBRow className="mb-2">
                <MDBCol>
                    <h5>Transfer asset:</h5>
                </MDBCol>
            </MDBRow>
            
            <MDBRow className="mb-4">
                <MDBCol>
                    <Select options={assetOptions} value={asset} onChange={handleChangeAsset} />
                </MDBCol>
                <MDBCol>
                    <MDBInput style={{ height: '39.59px' }} type='text' label='Amount' value={amount} onChange={handleChangeAmount} />
                  </MDBCol>
            </MDBRow>
            
            <MDBRow className="mb-2">
                <MDBCol>
                    <h5>From chain:</h5>
                </MDBCol>
                <MDBCol>
                    <h5>To chain:</h5>
                </MDBCol>
            </MDBRow>
            
            <MDBRow className="mb-4">
                <MDBCol>
                    <Select options={srcChainOptions} value={srcChain} onChange={handleChangeSrcChain} />
                </MDBCol>
                <MDBCol size='auto' className='px-0 my-auto'>
                    <MDBBtn block color='secondary' onClick={handleSwapChains}>
                        <MDBIcon icon='right-left' />
                    </MDBBtn>
                </MDBCol>
                <MDBCol>
                    <Select options={dstChainOptions} value={dstChain} onChange={handleChangeDstChain} />
                </MDBCol>
            </MDBRow>
      
            <MDBBtn block>
                Continue
            </MDBBtn>
        </>
    );
}

export default TabBridge;
