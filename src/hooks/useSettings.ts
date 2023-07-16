import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'
import { RootState } from '@/store/store'
import { setSettings } from '../redux/settings'
import { db } from '@/services/firebase'
import useLocalStorage from './useLocalStorage'

const useSettings = () => {
    const settings = useSelector((state: RootState) => state.settings)
    const [settingsStorage, setSettingsStorage] = useLocalStorage('settings', settings)
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    
    useEffect(() => {
        if (user === 'loading' || user === 'anonymous') {
            return
        }
        const unsubscribe = onValue(ref(db, 'settings/' + user), (snapshot) => {
            const snp = snapshot.val()
            setSettingsStorage(snp)
            dispatch(setSettings(snp))
        })
        return () => unsubscribe()
    }, [user])

    return settingsStorage
}

export default useSettings