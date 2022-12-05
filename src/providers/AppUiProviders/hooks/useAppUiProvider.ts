import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'
import { RootState } from '../../../store/store'
import { set } from '../redux'
import { db } from '../../../services/firebase'
import { Settings } from '../types'
import useLocalStorage from '../../../hooks/useLocalStorage'

const useAppUiProvider = () => {
    const [settingsStorage, setSettingsStorage] = useLocalStorage('settings', { locale: 'en', theme: 'light', units: 'm' })
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    const [settings, setSettings] = useState<Settings | undefined>()
    
    useEffect(() => {
        if (user === 'loading' || user === 'anonymous') {
            return
        }
        const unsubscribe = onValue(ref(db, 'settings/' + user), (snapshot) => {
            const snp = snapshot.val()
            dispatch(set(snp))
            setSettings(snp)
            console.log(snp)
            setSettingsStorage(snp)
        })
        return () => unsubscribe()
    }, [user])

    return settings
}

export default useAppUiProvider