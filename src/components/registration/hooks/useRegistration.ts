import { useState, useRef, useCallback, SyntheticEvent } from 'react'
import { auth } from '@/services/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { FirebaseError } from '../types'
import { useRegistrationProps } from '../types'
import { useRouter } from 'next/router'

const useRegistration = ({ locale }: useRegistrationProps) => {
    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const password2Ref = useRef<HTMLInputElement | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSubmit = useCallback(
        async (e: SyntheticEvent) => {
            e.preventDefault()
            setLoading(true)
            if (passwordRef?.current?.value !== password2Ref?.current?.value) {
                setError('auth/passwords-not-match')
                setLoading(false)
                return
            }
            try {
                await createUserWithEmailAndPassword(auth, emailRef?.current?.value || '', passwordRef?.current?.value || '')
                auth.currentUser && await sendEmailVerification(auth.currentUser)
                setLoading(false)
                router.push('/')
            } catch (error) {
                setError((error as FirebaseError).code)
                setLoading(false)
            }
        }, [emailRef, passwordRef]
    )

    return { emailRef, passwordRef, password2Ref, error, loading, onSubmit, locale }
}

export default useRegistration