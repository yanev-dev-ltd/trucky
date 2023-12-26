import { useState, useCallback } from 'react'
import { auth } from '@/services/firebase'
import { sendPasswordResetEmail } from "firebase/auth"
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { FirebaseError } from '../../../types'

const useForgotPassword = () => {
    const [forgotEmail, setForgotEmail] = useState('')
    const [forgotOpen, setForgotOpen] = useState(false)
    const [forgotLoading, setForgotLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const intl = useIntl()

    const handleForgotOpen = useCallback(() => {
        setForgotOpen(true)
    }, [])

    const handleForgotClose = useCallback(() => {
        setForgotOpen(false)
        setForgotEmail('')
    }, [])

    const handleForgotPassword = useCallback(async () => {
        try {
            setForgotLoading(true)
            await sendPasswordResetEmail(auth, forgotEmail)
            setForgotOpen(false)
            setForgotEmail('')
            enqueueSnackbar(intl.formatMessage({id: 'app.PasswordResetSuccess'}), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({id: `app.${(error as FirebaseError).code}`}), { variant: 'error' })
        } finally {
            setForgotLoading(false)
        }
    }, [])

    return { forgotEmail, setForgotEmail, forgotOpen, handleForgotClose, handleForgotOpen, handleForgotPassword, forgotLoading }
}

export default useForgotPassword