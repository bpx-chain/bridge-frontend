import Select from 'react-select';

function SelectChain(props) {
  function chainIdToOption(chainId) {
    return chainId ? {
      value: chainId,
      label: (
        <>
          <img src={props.options[chainId].icon} width="16" height="16" className="me-2" />
          {props.options[chainId].name}
        </>
      )
    } : null;
  };
  
  function optionToChainId(option) {
    return option ? parseInt(option.value) : null;
  };
  
  function handleChange(newValue) {
    props.onChange(optionToChainId(newValue));
  };
  
  let options = [];
  for(const chainId of Object.keys(props.options))
    options.push(chainIdToOption(chainId));
  
  return (
    <Select options={options} value={chainIdToOption(props.value)} onChange={handleChange} isDisabled={props.disabled} />
  );
}

export default SelectChain;
