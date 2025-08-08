import { useRef } from "react"

export const useCustomAlert = () => {
    const alertRef = useRef(null)

    const showSuccess = (title, message, buttons) => {
        alertRef.current?.showAlert("success", title, message, buttons)
    }

    const showError = (title, message, buttons) => {
        alertRef.current?.showAlert("error", title, message, buttons)
    }

    const showWarning = (title, message, buttons) => {
        alertRef.current?.showAlert("warning", title, message, buttons)
    }

    const showInfo = (title, message, buttons) => {
        alertRef.current?.showAlert("info", title, message, buttons)
    }

    const showSimple = (title, message, buttons) => {
        alertRef.current?.showAlert("simple", title, message, buttons)
    }

    const showWait = (title, message) => {
        alertRef.current?.showWait(title, message)
    }

    const hideWait = () => {
        alertRef.current?.hideWait()
    }

    const show = (type, title, message, buttons) => {
        alertRef.current?.showAlert(type, title, message, buttons)
    }

    return {
        alertRef,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showSimple,
        showWait,
        hideWait,
        show
    }
}
