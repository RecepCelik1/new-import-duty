import { createSlice } from '@reduxjs/toolkit'

const initialState = {

    itemSellingPrice : 0,
    shippingCharge : 0,

    typeOfGood : [
        {value : "gifts" , label : "Gifts"},
        {value : "exiseGoods" , label : "Exise Goods"},
        {value : "other" , label : "Other"},
    ],

    CimCif : [
        {value : "cif", label : "CIF"},
        {value : "fob", label : "FOB"},
    ],

    selectedTypeOfGood : {value : "other" , label : "Other"},

    selectedCimCif : {value : "cif", label : "CIF"},

}



export const ItemInfoSlice = createSlice({
  name: 'ItemInfoSlice',
  initialState,
  reducers: {
    handleInputChanges : (state , action) => {
        state[action.payload.field] = action.payload.value
    },
  },
})

export const { handleInputChanges } = ItemInfoSlice.actions

export default ItemInfoSlice.reducer