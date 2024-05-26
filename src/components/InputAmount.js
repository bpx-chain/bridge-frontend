import { MDBInput } from 'mdb-react-ui-kit';

function InputAmount(props) {
  function handleChange(e) {
    const regexp = new RegExp('^[0-9]{1,}(\.[0-9]{0,' + props.asset.decimals + '})?$');
    if (e.target.value === '' || regexp.test(e.target.value))
      props.onChange(e.target.value);
  };
  
  return (
    <MDBInput
      style={{
        height: '39.59px'
      }}
      type='text'
      label='Amount'
      value={props.value}
      onChange={handleChange}
      disabled={props.disabled} />
  );
}

export default InputAmount;
