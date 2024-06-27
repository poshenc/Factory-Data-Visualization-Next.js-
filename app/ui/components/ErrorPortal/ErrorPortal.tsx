import { Dialog } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { errorActions } from "../../store/error/error-action"

const ErrorPortal = () => {
    const dispatch = useDispatch()

    const { openDialog, title, message } = useSelector((state: RootState) => state.errorDialog)

    const closeHandler = () => {
        dispatch(errorActions.clearErrorDialog())
    }

    return (
        <Dialog open={openDialog} onClose={closeHandler}>
            {message &&
                <div className="m-20000rem">
                    <label className="page-title">Error!</label>
                    <hr className="mt-10000rem mb-10000rem" />
                    <div className="section-title">
                        Title: <span className="text-regular">{title}</span>
                    </div>
                    <div className="section-title">
                        Message: <span className="text-regular">{message}</span>
                    </div>
                </div>}
        </Dialog>
    )
}

export default ErrorPortal