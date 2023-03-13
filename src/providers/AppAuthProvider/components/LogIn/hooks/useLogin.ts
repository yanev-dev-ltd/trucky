import { useState, useCallback, useRef, SyntheticEvent } from 'react'
import { auth } from '@/services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from '../../../types'
import { useDispatch } from 'react-redux'
import { logout } from '../../../redux'

const useLogin = () => {
    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const onSubmit = useCallback(
        async (e: SyntheticEvent) => {
            e.preventDefault()
            setLoading(true)
            try {
                await signInWithEmailAndPassword(auth, emailRef?.current?.value || '', passwordRef?.current?.value || '')
                setLoading(false)
            } catch (error) {
                setError((error as FirebaseError).code)
                dispatch(logout())
                setLoading(false)
            }
        }, [emailRef, passwordRef]
    )
    return { onSubmit, loading, error, emailRef, passwordRef }
}

export default useLogin