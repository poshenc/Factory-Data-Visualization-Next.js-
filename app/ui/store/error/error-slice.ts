import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    openDialog: false,
    title: '',
    message: ''
}

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        showErrorDialog(state, action) {
            state.openDialog = true
            const { title, message } = action.payload
            state.message = message
            state.title = title
        },
        clearErrorDialog(state) {
            state.openDialog = false
            state.message = ''
            state.title = ''
        }
    }
})

export default errorSlice