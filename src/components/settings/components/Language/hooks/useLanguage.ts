import { useCallback, ChangeEvent } from 'react'
import { firestore, auth } from '@/services/firebase'
import { updateDoc, doc } from 'firebase/firestore'
import { useSnackbar } from 'notistack'

const useLanguage = () => {
    const { enqueueSnackbar } = useSnackbar()
    const handleChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        if (!auth?.currentUser?.uid) return
        try {
            await updateDoc(doc(firestore, 'settings', auth.currentUser.uid), { locale: (event.target as HTMLInputElement).value })
        } catch (error) {
            enqueueSnackbar((error as Error).message, { variant: 'error', persist: true })
        }
    }, [])

    return { handleChange }
}

export default useLanguage