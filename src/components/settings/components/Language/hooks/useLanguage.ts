import { useCallback, ChangeEvent } from 'react'
import { firestore, auth } from '@/services/firebase'
import { updateDoc, doc } from 'firebase/firestore'

const useLanguage = () => {
    const handleChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        if (!auth?.currentUser?.uid) return
        await updateDoc(doc(firestore, 'settings', auth.currentUser.uid), { locale: (event.target as HTMLInputElement).value })
    }, [])

    return { handleChange }
}

export default useLanguage