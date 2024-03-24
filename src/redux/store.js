import { configureStore } from '@reduxjs/toolkit'
import fetchCountries from './fetchCountries'
import itemInfoSlice from './itemInfoSlice'
import  fetchItems from './searchItems'
import fetchItemsProperties from './getItemStats'

export const store = configureStore({
  reducer: {
    countries : fetchCountries,
    itemInfos : itemInfoSlice,
    searchItems : fetchItems,
    itemStats : fetchItemsProperties,
  },
})