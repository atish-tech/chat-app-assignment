import { createSlice } from '@reduxjs/toolkit'

export const toggleSlice = createSlice({
    name : "toogle",
    initialState : {
        value: false,
    },
    reducers: {
        changeTheam : (state) => {
            state.value = !state.value
        }
    }
})

export const {changeTheam} = toggleSlice.actions;
export default toggleSlice.reducer;