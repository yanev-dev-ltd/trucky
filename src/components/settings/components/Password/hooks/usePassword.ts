import { useRef, useCallback, useState, SyntheticEvent } from 'react'
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { FirebaseError } from '../../../../../providers/AppAuthProvider/types'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'

const usePassword = () => {
    const oldPasswordRef = useRef<HTMLInputElement>(null)
    const newPasswordRef = useRef<HTMLInputElement>(null)
    const newPassword2Ref = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const [loading, setLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const intl = useIntl()

    const changePassword = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault()
        setLoading(true)
        if (newPasswordRef?.current?.value !== newPassword2Ref?.current?.value) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.auth/passwords-not-match',
            }), { variant: 'error', persist: true })
            setLoading(false)
            return
        }
        try {
            await signInWithEmailAndPassword(auth, auth.currentUser?.email || '', oldPasswordRef.current?.value || '')
            auth.currentUser && newPasswordRef.current?.value && await updatePassword(auth.currentUser, newPasswordRef.current?.value)
            enqueueSnackbar(intl.formatMessage({
                id: 'app.ChangePasswordSuccess',
            }), { variant: 'success' })
            formRef.current?.reset()
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `app.${(error as FirebaseError).code}`,
            }), { variant: 'error', persist: true })
        } finally {
            setLoading(false)
        }
    },[])
    return { oldPasswordRef, newPasswordRef, newPassword2Ref, formRef, changePassword, loading }
}

export default usePassword