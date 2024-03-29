import { useSelector } from "react-redux"

const Consequences = () => {

    const primalItem = useSelector(state => state.itemStats.item)
    const subItem = useSelector(state => state.itemStats.subItem)
    const selectedCountry = useSelector(state => state.countries.selectedCountry.value)
    const itemInfos = useSelector(state => state.itemInfos)
    const itemID = useSelector(state => state.searchItems.commodityID)

    let commodtyData
    
    if(primalItem?.data?.type === "commodity") {
        commodtyData = primalItem
        
    } else if(primalItem?.data?.type === "heading") {
        commodtyData = subItem
    }
    
    //function for seperate measure objects in included section
    const seperateMesuras = (item) => {
        let guideMeasuraArray = item?.data?.relationships?.import_measures.data;
        let included = item?.included;
    
        const tariffObjects = [];
        const vatObjects = [];
        const otherObjects = [];
    
        guideMeasuraArray?.forEach(guideObj => {
            const matchedObj = included.find(includedObj => includedObj.id === guideObj.id);
            if (matchedObj) {
                const geographicalAreaId = matchedObj.relationships?.geographical_area?.data?.id;
                const measureTypeId = matchedObj.relationships?.measure_type?.data?.id;
                
                if (measureTypeId === "103" && geographicalAreaId === "1011") {
                    tariffObjects.push({
                        measure: matchedObj,
                        geographical_area: included.find(areaObj => areaObj.id === geographicalAreaId)
                    });
                } else if (matchedObj.id < 0) {
                    vatObjects.push({
                        measure: matchedObj,
                        geographical_area: included.find(areaObj => areaObj.id === geographicalAreaId)
                    });
                } else {
                    otherObjects.push({
                        measure: matchedObj,
                        geographical_area: included.find(areaObj => areaObj.id === geographicalAreaId)
                    });
                }
            }
        });
    
        return { tariffObjects, vatObjects, otherObjects };
    }
    const { tariffObjects, vatObjects, otherObjects } = seperateMesuras(commodtyData);

    const searchMatchingObjects = (pilotObject, includedObjects) => {

        const dutyExpressionId = pilotObject?.measure?.relationships.duty_expression.data.id;
        const measureComponentsIds = pilotObject?.measure?.relationships.measure_components.data.map(item => item.id);
    
       
        const matchingDutyExpressionObject = includedObjects?.find(obj =>
            obj.id === dutyExpressionId);
    
        
        const matchingMeasureComponentsObjects = measureComponentsIds?.map(id =>
            includedObjects.find(obj => obj.id === id)
        );
    
       
        const resultingObject = {
            duty_expression: matchingDutyExpressionObject || {},
            measure_components: matchingMeasureComponentsObjects?.filter(Boolean) 
        };
    
        return resultingObject;
    };

// Function to search for geographical areas and check excluded countries for VAT objects
const searchGeographicalAreasForVAT = (countryId, vatObjects) => {
    let matchedObject = null; 

    for (let i = 0; i < vatObjects.length; i++) {
        const geographicalArea = vatObjects[i].geographical_area;
        const measure = vatObjects[i].measure;

       
        if (geographicalArea.id === countryId || (geographicalArea.relationships && geographicalArea.relationships.children_geographical_areas && geographicalArea.relationships.children_geographical_areas.data.some(childArea => childArea.id === countryId))) {
            
            const excludedCountries = measure.relationships?.excluded_countries?.data || [];
            const isExcluded = excludedCountries.some(excludedCountry => excludedCountry.id === countryId);

            if (!isExcluded) {
               
                matchedObject = {
                    measure,
                    geographical_area: geographicalArea
                };
                break; 
            }
        }
    }


    return matchedObject;
};

const matchedObjectForVAT = searchGeographicalAreasForVAT(selectedCountry, vatObjects);

const matchingVatMesureObjects = searchMatchingObjects(matchedObjectForVAT, commodtyData?.included);


// Function to search for geographical areas and check excluded countries
const searchGeographicalAreas = (countryId, otherObjects) => {
    let matchedObject = null; 

    for (let i = 0; i < otherObjects.length; i++) {
        const geographicalArea = otherObjects[i].geographical_area;
        const measure = otherObjects[i].measure;

        
        if (geographicalArea.id === "1011") {
            continue; 
        }

        
        if (geographicalArea.id === countryId || (geographicalArea.relationships && geographicalArea.relationships.children_geographical_areas && geographicalArea.relationships.children_geographical_areas.data.some(childArea => childArea.id === countryId))) {
            
            const excludedCountries = measure.relationships?.excluded_countries?.data || [];
            const isExcluded = excludedCountries.some(excludedCountry => excludedCountry.id === countryId);

            if (!isExcluded) {
                
                matchedObject = {
                    measure,
                    geographical_area: geographicalArea
                };
                break; 
            }
        }
    }

    return matchedObject;
};

const matchedObject = searchGeographicalAreas(selectedCountry, otherObjects);

    let matchedImportDutyObjects = null

if (matchedObject) {

    matchedImportDutyObjects = searchMatchingObjects(matchedObject , commodtyData?.included)
} else {

    matchedImportDutyObjects = searchMatchingObjects(tariffObjects[0] , commodtyData?.included)
}

    let dutyExpression = ""
    let dutyRate 
    let measureComponents = matchedImportDutyObjects?.measure_components

    if(matchedImportDutyObjects?.measure_components !== undefined){

         for (let i = 0; i < measureComponents.length; i++) {

            if(measureComponents[i]?.attributes.measurement_unit_code !== undefined){
                dutyExpression = matchedImportDutyObjects?.duty_expression?.attributes?.verbose_duty
                
            }
            if(measureComponents[i]?.attributes.measurement_unit_code === null){
                dutyRate = measureComponents[i]?.attributes?.duty_amount
            }

        } 
    }

    if(isNaN(dutyRate)){
        dutyRate = 0
    }


    let VATrate
    if(matchingVatMesureObjects?.measure_components !== undefined) {
        VATrate = matchingVatMesureObjects?.measure_components[0]?.attributes?.duty_amount
    } else {
        VATrate = 0
    }

    if(isNaN(VATrate)){
        VATrate = 0
    }

    let itemPrice = itemInfos.itemSellingPrice
    let shippingCharge = itemInfos.shippingCharge
    let absolutePrice
    if (itemInfos.selectedCimCif.value === "cif") {
        absolutePrice = itemPrice + shippingCharge
    } else {
        absolutePrice = itemPrice
    }   

    if(itemInfos.selectedTypeOfGood.value === "gifts"){

        if(absolutePrice >= 40){
          VATrate = VATrate + 0
        } else {
          VATrate = 0
        }

        dutyRate = 0

    } else if (itemInfos.selectedTypeOfGood.value === "exiseGoods") {
        dutyRate = dutyRate + 0
        VATrate = VATrate + 0
    } else if (itemInfos.selectedTypeOfGood.value === "other") {
        dutyRate = 0
        VATrate = VATrate + 0
    }

    let VatAmount = absolutePrice * VATrate / 100
    let dutyAmount = absolutePrice * dutyRate / 100


    let totalPayment = itemPrice + shippingCharge + VatAmount + dutyAmount

    
    return (
        <div className="w-full flex flex-col p-1">
            <div className="w-full p-3 flex flex-col bg-gray-200 rounded-md">
            <div className="flex justify-between">
                <div className="flex flex-col font-bold text-lg">
                    <div>Total for</div>
                    <div>{itemID}</div>
                </div>
                <div className="flex justify-center font-bold text-xl">{totalPayment} GBP</div>
            </div>

            <div className="flex justify-between items-center mt-2">
                <div className="text-gray-600  font-gabarito text-lg">Shipping / Insurance</div>
                <div className="font-gabarito text-gray-600 flex justify-center text-lg">{shippingCharge} GBP</div>
            </div>

            <div className="flex justify-between items-center mt-2">
                <div className="text-gray-600  font-gabarito text-lg">Import duty - {dutyRate}%</div>
                <div className="font-gabarito text-gray-600 flex justify-center text-lg">{dutyAmount} GBP</div>
            </div>

            <div className="flex justify-between items-center mt-2">
                <div className="text-gray-600  font-gabarito text-lg">VAT - {VATrate}</div>
                <div className="font-gabarito text-gray-600 flex justify-center text-lg">{VatAmount} GBP</div>
            </div>

            
        </div>
        <div className="p-3 font-gabarito">Duty Infos : {dutyExpression}</div>
        </div>

    )
}

export default Consequences