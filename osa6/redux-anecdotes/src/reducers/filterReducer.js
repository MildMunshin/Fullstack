import { createSlice } from '@reduxjs/toolkit'

// const filterReducer = (state = '', action) => {
//     switch (action.type) {
//         case 'SET_FILTER':
//             return action.payload
//         default:
//             return state
//     }
// }

// export const setFilter = (value) => {
//     return {
//         type: 'SET_FILTER',
//         payload: value
//     }
// }

// export default filterReducer

const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
        setFilter(state, action) {
            const value = action.payload
            return value
        }
    }
})

export const { setFilter } =
filterSlice.actions

export default filterSlice.reducer