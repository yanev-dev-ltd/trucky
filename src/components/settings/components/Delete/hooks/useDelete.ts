import { useState } from 'react'
import { deleteUser, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { FirebaseError } from '../../../../../providers/AppAuthProvider/types'

const useDelete = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState<string | undefined>()
    const [error, setError] = useState(null)

    const handleModalClose = () => {
        setModalOpen(false)
        setPassword(undefined)
        setError(null)
        setLoading(false)
    }

    const handleModalOpen = () => {
        setModalOpen(true)
    }

    const handleDeleteAccount = async () => {
        if (!password) return
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, auth.currentUser?.email || '', password || '')
            auth?.currentUser && deleteUser(auth?.currentUser).then(() => {
                signOut(auth)
                setLoading(false)
            })
        } catch (error) {
            setError((error as FirebaseError).code)
            setLoading(false)
        }
    }

    return { handleDeleteAccount, handleModalOpen, handleModalClose, modalOpen, password, setPassword, loading, error }
}

export default useDelete