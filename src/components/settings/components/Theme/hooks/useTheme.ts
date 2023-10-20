import { useCallback, ChangeEvent } from 'react'
import { firestore, auth } from '@/services/firebase'
import { updateDoc, doc } from 'firebase/firestore'

const useTheme = () => {
    const handleChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        if (!auth?.currentUser?.uid) return
        await updateDoc(doc(firestore, 'settings', auth.currentUser.uid), { theme: (event.target as HTMLInputElement).value })
    }, [])

    return { handleChange }
}

export default useTheme