import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    items : [],
}

export const fetchData = createAsyncThunk(
    'data/fetchData',
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

export const fetchItems = createSlice({
  name: 'fetchItems',
  initialState,
  reducers: {
      handleEmptySearchBox : (state , action) => {
        state.items = action.payload
      }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      const exactItemDatas = action.payload.data.map((item, i) => ({
        value: item.attributes.goods_nomenclature_item_id,
        label: item.attributes.title.toUpperCase(),
        i: i,
    }));
        state.items = exactItemDatas;
      })
  },
})

export const { handleEmptySearchBox } = fetchItems.actions

export default fetchItems.reducer