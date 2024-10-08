import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // do npm i --save react-select then restart npm run dev

const MemberDropdown = ({ inputValue, options, handleSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filteredOptions);
  }, [inputValue, options]);

  return (
    <Select
      value={inputValue}
      onChange={handleSelect}
      options={suggestions}
      placeholder="Select a member..."
    />
  );
};

export default MemberDropdown;