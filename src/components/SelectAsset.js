import Select from 'react-select';

function SelectAsset(props) {
  function symbolToOption(symbol) {
    return symbol ? {
      value: symbol,
      label: (
        <>
          <img src={props.options[symbol].icon} width="16" height="16" className="me-2" />
          {props.options[symbol].name} ({symbol})
        </>
      )
    } : null;
  };
  
  function optionToSymbol(option) {
    return option ? option.value : null;
  };
  
  function handleChange(newValue) {
    props.onChange(optionToSymbol(newValue));
  };
  
  let options = [];
  for(const symbol of Object.keys(props.options))
    options.push(symbolToOption(symbol));
  
  return (
    <Select options={options} value={symbolToOption(props.value)} onChange={handleChange} isDisabled={props.disabled} />
  );
}

export default SelectAsset;
