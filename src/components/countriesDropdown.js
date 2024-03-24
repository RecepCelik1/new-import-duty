import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { setSelectedCountry } from "../redux/fetchCountries";

const CountriesDropdown = () => {

    const dispatch = useDispatch()
    const datas = useSelector(state => state.countries)
    
    const countries = datas?.countries
    const selectedCountry = datas?.selectedCountry

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight : "6px",
          }),
      };

      return (
      <div className="w-full flex flex-col">

            <div className="mb-1 font-gabarito flex justify-start items-center">Shipment origin</div>
            <Select
                options={countries}
                styles={customStyles}
                isSearchable
                onChange={(selectedOption) => dispatch(setSelectedCountry(selectedOption))}
                value={selectedCountry}
            />
      </div>
      )

}

export default CountriesDropdown