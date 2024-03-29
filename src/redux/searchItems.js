import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    items : [],
    commodityID : null
}

export const fetchData = createAsyncThunk(
    'data/fetchData',
    async (keyword) => {
      try {
        const response = await fetch(`https://www.trade-tariff.service.gov.uk/api/v2/search_references.json?query[letter]=${keyword}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        if(data.data.length === 0){
          const res = await fetch(`https://www.trade-tariff.service.gov.uk/api/v2/commodities/${keyword}`);
            if(!res.ok) {
              throw new Error('Network response was not ok');
            }
          
          const result = await res.json()
          let formateDate = {data : [{
            attributes : {
              goods_nomenclature_item_id : result.data.attributes.goods_nomenclature_item_id,
              title : result.data.attributes.description_plain
            }
          }]}

          return formateDate

        } else {
          return data;
        }


      } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
      }
    }
  );

export const fetchItems = createSlice({
  name: 'fetchItems',
  initialState,
  reducers: {
      handleEmptySearchBox : (state , action) => {
        state.items = action.payload
      },
      setCommodityID : (state , action) => {
        state.commodityID = action.payload
      }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
       const exactItemDatas = action.payload.data.map((item, i) => ({
        value: item.attributes.goods_nomenclature_item_id,
        label: item.attributes.title.toUpperCase(),
        i: i,
    }));
        state.items = exactItemDatas
      })
  },
})

export const { handleEmptySearchBox , setCommodityID } = fetchItems.actions

export default fetchItems.reducer