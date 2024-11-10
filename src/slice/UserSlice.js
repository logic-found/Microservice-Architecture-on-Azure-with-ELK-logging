import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name : 'user',
    initialState : {
        auth : false,
        username : null
    },
    reducers : {
        setAuth : (state, action) => {
            state.auth = action.payload
        },
        setUsername : (state, action) => {
            state.username = action.payload
        }
    }
})

export const {setAuth, setUsername} = userSlice.actions
export default userSlice.reducer