import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { setSelectedCountry } from "../redux/fetchCountries";

const CountriesDropdown = () => {

    const dispatch = useDispatch()
    const datas = useSelector(state => state.countries) 
    const countries = datas?.countries
    const selectedCountry = datas?.selectedCountry

    const options = [
      { value: 'option3', label: 'United Kingdom' },
    ];

    const customStyles = { //=> for dropdown menu customize
        option: (provided, state) => ({
          ...provided, 
          color: state.isSelected ? 'white' : 'black',
          background: state.isSelected ? '#0285c7' : state.isFocused ? '#38bdf8' : 'white',
          fontSize : '12px',
        }),
        control: (provided) => ({
          ...provided,

        }),
        menu: (provided, state) => ({
            ...provided,
            borderRadius: '8px',
            overflowY: 'auto',
            
          }),
          menuList: (provided, state) => ({
            ...provided,
            padding: 0,
            fontSize: '12px', 
            backgroundColor: state.isFocused ? '#e6f7ff' : 'white', // 
            borderRadius: '8px',
        }),

      };

      return (
      <div className="w-full flex flex-col">
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
        <div className="w-full flex flex-col mt-4">
          <div className="mb-1 font-gabarito flex justify-start items-center">Shipment destination</div>
              <Select
                  options={options}
                  isDisabled = {true}
                  value={options[0]}
              />
        </div>

      </div>
      )

}

export default CountriesDropdown