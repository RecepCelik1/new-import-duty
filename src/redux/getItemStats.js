import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    item : [],
    subItems : [],

    subItem : []
}

export const fetchItemStats = createAsyncThunk(
    'data/fetchItemStats',
    async (apiUrl) => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
      }
    }
  );
  
export const fetchSubItemStats = createAsyncThunk(
    'data/fetchSubItemStats',
    async (apiUrl) => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
      }
    }
  );

export const fetchItemsProperties = createSlice({
  name: 'fetchItemsProperties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchItemStats.fulfilled, (state, action) => {
        state.item = action.payload;

        if (state.item.data.relationships.commodities !== undefined) {
          const matchingObjects = [];
      
          state.item.data.relationships.commodities.data.forEach((firstObj, index) => {
              const matchingObjectInLargeArray = state.item.included.find(largeObj => largeObj.id === firstObj.id);
              if (matchingObjectInLargeArray) {
                  const { goods_nomenclature_item_id, description } = matchingObjectInLargeArray.attributes;
                  matchingObjects.push({
                      value: goods_nomenclature_item_id,
                      label: description,
                      i: index // Eklenen indeks numarası
                  });
              }
          });
      
          state.subItems = matchingObjects;
      }

      })
    builder.addCase(fetchSubItemStats.fulfilled, (state, action) => {
        state.subItem = action.payload;
      })
  },
})

// eslint-disable-next-line
export const {} = fetchItemsProperties.actions

export default fetchItemsProperties.reducer