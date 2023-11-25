import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { setSettings } from '../redux/settings'
import { firestore } from '@/services/firebase'
import useLocalStorage from './useLocalStorage'
import { doc, onSnapshot } from 'firebase/firestore'

const useSettings = () => {
    const settings = useSelector((state: RootState) => state.settings)
    const [settingsStorage, setSettingsStorage] = useLocalStorage('settings', settings)
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    
    useEffect(() => {
        if (user === 'loading' || user === 'anonymous') {
            return
        }
        const unsubscribe = onSnapshot(doc(firestore, 'settings', user), (doc) => {
            const data = doc.data()
            data && setSettingsStorage(data)
            dispatch(setSettings(data || settingsStorage))
        })
        return () => unsubscribe()
    }, [user])

    return settingsStorage
}

export default useSettings