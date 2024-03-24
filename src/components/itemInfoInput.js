import { useDispatch , useSelector } from "react-redux"
import { handleInputChanges } from "../redux/itemInfoSlice";
import CountryFlag from 'react-country-flag';  
import Select from "react-select";

const ItemInfos = () => {

    const dispatch = useDispatch()
    const datas = useSelector(state => state.itemInfos)

    const parsingFunction = (event , field) => {

        const filteredValue = event.replace(/[^0-9,.]/g, "");
        let parsedValue = parseFloat(filteredValue.replace("," , "."));

        if(isNaN(parsedValue)) {
            parsedValue = 0
        }

        dispatch(handleInputChanges({value : parsedValue , field}))

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
          height : '48px',
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
        <div className="w-full flex flex-col ">

            <div>

                <div className="w-full flex flex-col">
                    <div className="mb-1 font-gabarito flex justify-start items-center">Item selling price</div>
                    <div className="relative">
                        <input 
                            className="h-12 p-2 rounded-[5px] w-full border-2 border-gray-300"
                            onChange={(e) => parsingFunction(e.target.value , "itemSellingPrice")}
                        />

                        <span><CountryFlag className='absolute bottom-[14px] right-14 rounded-full' countryCode="GB" svg style={{ width: '35px', height: '20px' }} /></span>
                        <span className="absolute bottom-3 right-3 font-gabarito text-gray-500">GBP</span>
                    </div>

                </div>

                <div className="w-full flex flex-col mt-8">
                    <div className="mb-1 font-gabarito flex justify-start items-center">Shipping / Insurance (messages.optional)</div>
                    <div className="relative">
                        <input 
                            className="h-12 p-2 rounded-[5px] w-full border-2 border-gray-300"
                            onChange={(e) => parsingFunction(e.target.value , "shippingCharge")}
                        />

                        <span><CountryFlag className='absolute bottom-[14px] right-14 rounded-full' countryCode="GB" svg style={{ width: '35px', height: '20px' }} /></span>
                        <span className="absolute bottom-3 right-3 font-gabarito text-gray-500">GBP</span>
                    </div>
                </div>

            </div>

            <div className="flex justify-center items-center w-full mt-8">
                <div className="flex flex-col w-full p-1">
                    <div className="mb-1 font-gabarito">Type of goods</div>
                    <Select
                        options={datas.typeOfGood}
                        styles={customStyles}
                        isSearchable
                        onChange={(selectedOption) => dispatch(handleInputChanges({value : selectedOption , field : "selectedTypeOfGood"}))}
                        value={datas.selectedTypeOfGood}
                    />
                </div>

                <div className="flex flex-col w-full p-1">

                    <div className="mb-1 font-gabarito">CIF or FOB</div>
                    <Select
                        options={datas.CimCif}
                        styles={customStyles}
                        isSearchable
                        onChange={(selectedOption) => dispatch(handleInputChanges({value : selectedOption , field : "selectedCimCif"}))}
                        value={datas.selectedCimCif}
                    />
                </div>
            </div>

        </div>
    )
}

export default ItemInfos