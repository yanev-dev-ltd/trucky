import { useState, useEffect } from 'react'
import { auth } from '@/services/firebase'
import { sendEmailVerification } from 'firebase/auth'
import { useRouter } from 'next/router'

const useEmailVerification = () => {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const router = useRouter()

    useEffect(() => {
        let interval = setInterval(async() => {
            auth.currentUser && await auth.currentUser.reload()
            if (auth.currentUser?.emailVerified) {
                clearInterval(interval)
                setSent(false)
                setLoading(false)
                router.push('/')
            }
        }, 1000)
      
        return () => {
            clearInterval(interval)
        }
    }, [auth.currentUser?.emailVerified])

    const resendEmailVerification = async () => {
        setLoading(true)
        try {
            auth.currentUser && await sendEmailVerification(auth.currentUser)
            setLoading(false)
            setSent(true)
        } catch (error) {
            setLoading(false)
        }
    }

    return { resendEmailVerification, loading, sent }
}

export default useEmailVerification