// SearchBox.js

import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, handleEmptySearchBox } from '../redux/searchItems';
import Select from 'react-select';
import {fetchItemStats, fetchSubItemStats} from '../redux/getItemStats.js';


const SearchBox = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const searchResults = useSelector(state => state.searchItems.items)
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [selectedItem , setSelectedItem] = useState([]) 
    const getOptionValue = (option) => option.i;
    const inputRef = useRef(null); // Ref for input element

    const selectedItemStats = useSelector(state => state.itemStats.item)
    const subItems = useSelector(state => state.itemStats.subItems)
    
    const dispatch = useDispatch()

    const handleSearchChange = (e) => {

        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);

        if (newSearchTerm !== '') {
            // eslint-disable-next-line
            dispatch(fetchData(`https://www.trade-tariff.service.gov.uk/api/v2/search_references.json?query[letter]=${newSearchTerm}`))

        } else {
            dispatch(handleEmptySearchBox([]))
        }

    };

    const handleInputFocus = () => {
        setMenuOpen(true); 
    };

    const handleInputBlur = () => {
        setMenuOpen(false);
    };

    const handleSelectOnclick = (selectedOption) => {
        setSelectedItem(selectedOption)
        setMenuOpen(false)
        if (inputRef.current) {
            inputRef.current.blur(); // Input kutusunu blur yap
        }
        setSearchTerm(selectedOption.label)
        const commodityID = parseFloat(selectedOption.value)
        dispatch(fetchItemStats(`https://www.trade-tariff.service.gov.uk/api/v2/commodities/${commodityID}`))
    }

    const handleSubCategoryClick = (selectedOption) => {
        const commodityID = parseFloat(selectedOption.value)
        dispatch(fetchSubItemStats(`https://www.trade-tariff.service.gov.uk/api/v2/commodities/${commodityID}`))
    }

    const customStyles = { //=> for dropdown menu customize
        option: (provided, state) => ({
          ...provided, 
          color: state.isSelected ? 'white' : 'black',
          background: state.isSelected ? '#0285c7' : state.isFocused ? '#38bdf8' : 'white',
          fontSize : '12px',
        }),
        control: (provided) => ({
          ...provided,
          width: '100%',
          minHeight: "48px",
          height : '45px',
          borderRadius: '5px',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize : "16px",
          maxHeight: '20px',
        }),
        menu: (provided, state) => ({
            ...provided,
            borderRadius: '8px',
            overflowY: 'auto',
            
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
          menuList: (provided, state) => ({
            ...provided,
            padding: 0,
            fontSize: '12px', 
            backgroundColor: state.isFocused ? '#e6f7ff' : 'white', // 
            borderRadius: '8px',
            
        }),
          dropdownIndicator: (provided, state) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight : "6px",
          }),
      };

      const subitemDropdonwsStyle = { //=> for dropdown menu customize
        option: (provided, state) => ({
          ...provided, 
          color: state.isSelected ? 'white' : 'black',
          background: state.isSelected ? '#0285c7' : state.isFocused ? '#38bdf8' : 'white',
          fontSize : '12px',
        }),
        control: (provided) => ({
          ...provided,
          width: '100%',
          minHeight: "48px",
          height : '45px',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize : "16px",
          maxHeight: '20px',
        }),
        menu: (provided, state) => ({
            ...provided,
            borderRadius: '8px',
            overflowY: 'auto',
            
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
          menuList: (provided, state) => ({
            ...provided,
            padding: 0,
            fontSize: '12px', 
            backgroundColor: state.isFocused ? '#e6f7ff' : 'white', // 
            borderRadius: '8px',
            
        }),
          dropdownIndicator: (provided, state) => ({
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight : "6px",
          }),
      }

    return (
        <div className="relative w-full pr-1 pl-1">
            <div>

            </div>
            <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm font-gabarito"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleInputFocus} // Show results on focus
                onBlur={handleInputBlur} // Hide results on blur
                ref={inputRef}
            />

            <Select
                options={searchResults}
                styles={customStyles}
                isSearchable
                getOptionValue={getOptionValue}
                menuIsOpen={isMenuOpen}
                onChange={(selectedOption) => handleSelectOnclick(selectedOption)}
                value={selectedItem}
            />

        <div className={`transition-all duration-[500ms] ease-in-out ${selectedItemStats.data?.relationships?.commodities !== undefined ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>    
            <div className="w-full mt-4 flex flex-col">
                <div className="font-gabarito mb-1">Please select subcategory</div>
                    <Select
                        onChange={(selectedOption) => handleSubCategoryClick(selectedOption)}
                        options={subItems}
                        getOptionValue={getOptionValue}
                        styles={subitemDropdonwsStyle}
                    />
            </div>
        </div>
            
        </div>
    );
};

export default SearchBox;
