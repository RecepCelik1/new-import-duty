import { createSlice , createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  countries: [],
  selectedCountry: {},
}

export const getCountries = createAsyncThunk('getCountries', async()=> {
    const {data} = await axios.get('https://www.trade-tariff.service.gov.uk/api/v2/geographical_areas/countries')
    return data
})

export const fetchCountrySlice = createSlice({
  name: 'fetchCountrySlice',
  initialState,
  reducers: {
    setSelectedCountry : (state , action) => {
        state.selectedCountry = action.payload
    },
  },
  extraReducers : (builder) => {
    builder.addCase(getCountries.fulfilled , (state , action) => {

        const exactCountryDatas = action.payload.data.map(item => ({
            value: item.attributes.id,
            label: item.attributes.description
          }));


        state.countries = exactCountryDatas
        state.selectedCountry = state.countries[0]
    })
  }
})

export const { setSelectedCountry } = fetchCountrySlice.actions

export default fetchCountrySlice.reducer