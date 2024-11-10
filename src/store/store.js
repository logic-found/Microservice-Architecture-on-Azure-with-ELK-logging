import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import NotesSlice from '../slice/NotesSlice'
import UserSlice from '../slice/UserSlice'

const reducer = combineReducers({
    notes : NotesSlice,
    user : UserSlice
})
const store = configureStore({ reducer })

export default store