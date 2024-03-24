import React from "react";
import CountriesDropdown from "./components/countriesDropdown";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCountries } from "./redux/fetchCountries";
import ItemInfos from "./components/itemInfoInput";
import SearchBox from "./components/searchBox";
import Consequences from "./components/consequences";
function App() {

  const dispatch = useDispatch()

  useEffect(()=> {
    dispatch(getCountries())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  return (
    <div className="h-full min-h-screen w-full bg-gray-800 flex justify-center items-center p-4">
      <div className="bg-white w-96 p-8 flex flex-col rounded-2xl"> {/* main container */}
        <div className="mt-4 mb-4">
          <div className="flex justify-center items-center w-full"><CountriesDropdown/></div>
          <div className="flex justify-center items-center mt-8 w-full"><ItemInfos/></div>
          <div className="flex justify-center items-center mt-8 w-full"><SearchBox/></div>
          <div className="flex justify-center items-center mt-8 w-full"><Consequences/></div>
              <div className="flex justify-center items-center mt-8 w-full font-gabarito">The information is based on the UK Tariff. Startxpress is not responsible for the incorrect interpretation of the information or for any errors & omissions that may result as a consequence of the information displayed in this tool.</div>
        </div>
      </div>
    </div>
  );
}

export default App;
