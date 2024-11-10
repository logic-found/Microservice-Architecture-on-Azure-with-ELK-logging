import { createSlice } from "@reduxjs/toolkit";

const notesSlice = createSlice({
    name : 'notes',
    initialState : {
        allNotes : []
    },
    reducers : {
        getAllNotes : (state, action) => {
            state.allNotes = action.payload
        },
        addNote : (state, action) => {
            state.allNotes.push(action.payload)
        },
        updateNote : (state, action) => {
            const updatedNote = action.payload
            state.allNotes = state.allNotes.map((note) => {
                return (note._id === updatedNote._id)? updatedNote:note
            })
        },
        deleteNote : (state, action) => {
            const deletedNote = action.payload
            state.allNotes = state.allNotes.filter((note) => note._id !== deletedNote._id)
        }
    }
})

export const { getAllNotes, addNote, updateNote, deleteNote} = notesSlice.actions
export default notesSlice.reducer