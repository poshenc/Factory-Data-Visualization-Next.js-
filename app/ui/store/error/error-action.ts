import { Dispatch } from "redux"
import errorSlice from "./error-slice"

export const errorActions = errorSlice.actions

export const showErrorDialog = (message: string, title: string) => (dispatch: Dispatch) => {
    return dispatch(errorActions.showErrorDialog({ message, title }))
}

export const removeErrorDialog = () => (dispatch: any) => {
    return dispatch(errorActions.clearErrorDialog())
}