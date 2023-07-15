import { useCallback, ChangeEvent } from 'react'
import { db, auth } from '@/services/firebase'
import { ref, update } from 'firebase/database'

const useLanguage = () => {
    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (!auth?.currentUser?.uid) return
        update(ref(db, 'settings/' + auth.currentUser.uid), { locale: (event.target as HTMLInputElement).value })
    }, [])

    return { handleChange }
}

export default useLanguage