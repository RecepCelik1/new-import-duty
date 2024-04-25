import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    item : [],

    isThereAnySubItem :false,
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
  reducers: {
    clearSelectedSubItem : (state , action) => {
      state.subItem = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItemStats.fulfilled, (state, action) => {
        state.item = action.payload;

        if (state.item.data.type === "heading") {
          const matchingObjects = [];
          
          state.item.data.relationships.commodities.data.forEach((firstObj, index) => {
              const matchingObjectInLargeArray = state.item.included.find(largeObj => largeObj.id === firstObj.id);
              if (matchingObjectInLargeArray) {
                  const { goods_nomenclature_item_id, description } = matchingObjectInLargeArray.attributes;
                  matchingObjects.push({
                      value: goods_nomenclature_item_id,
                      label: description,
                      i: index
                  });
              }
          });
          
          state.subItems = matchingObjects;
          state.isThereAnySubItem = true
      } else {
        state.subItems = [];
        state.isThereAnySubItem = false
      }

      })
      .addCase(fetchItemStats.rejected, (state, action) => {
        state.item = [];
        state.subItems = []
        state.isThereAnySubItem = false
    })
    builder.addCase(fetchSubItemStats.fulfilled, (state, action) => {
        state.subItem = action.payload;
      })
      .addCase(fetchSubItemStats.rejected , (state, action) => {
        state.subItem = []
      })
  },
})

// eslint-disable-next-line
export const {clearSelectedSubItem} = fetchItemsProperties.actions

export default fetchItemsProperties.reducer