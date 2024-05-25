import {useState} from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBBtn
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
    };
    
    function handleChangeAmount(e) {
        const regexp = new RegExp('^[0-9]{1,}(\.[0-9]{0,' + assets[asset.value].decimals + '})?$');
        if (e.target.value === '' || regexp.test(e.target.value))
            setAmount(e.target.value);
        else
            setAmount(amount);
    };
  
    return (
        <form>
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
                    <Select options={assetOptions} />
                </MDBCol>
                <MDBCol>
                    <Select options={assetOptions} />
                </MDBCol>
            </MDBRow>
      
            <MDBBtn type='submit' block>
                Continue
            </MDBBtn>
        </form>
    );
}

export default TabBridge;
