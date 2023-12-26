import { useState, useCallback, useRef, SyntheticEvent } from 'react'
import { auth } from '@/services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from '../../../types'
import { useDispatch } from 'react-redux'
import { logout } from '../../../redux'
import useLocalStorage from '@/hooks/useLocalStorage';
import { useSnackbar } from 'notistack';
import { useIntl } from 'react-intl';

const useLogin = () => {
    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const intl = useIntl()
    const [settingsStorage] = useLocalStorage('settings', { locale: 'en' })

    const onSubmit = useCallback(
        async (e: SyntheticEvent) => {
            e.preventDefault()
            setLoading(true)
            try {
                await signInWithEmailAndPassword(auth, emailRef?.current?.value || '', passwordRef?.current?.value || '')
                closeSnackbar()
                setLoading(false)
            } catch (error) {
                enqueueSnackbar(intl.formatMessage({id: `app.${(error as FirebaseError).code}`}), { variant: 'error' })
                dispatch(logout())
                setLoading(false)
            }
        }, [emailRef, passwordRef]
    )
    return { onSubmit, loading, emailRef, passwordRef, locale: settingsStorage.locale }
}

export default useLogin