import { useState, useCallback, SyntheticEvent, useEffect } from 'react'
import { firestore, auth } from '@/services/firebase'
import { setDoc, doc, onSnapshot } from 'firebase/firestore'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import { Profile } from '../types'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { setProfile as setProfileRedux } from '../redux'

const useProfile = () => {
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState<Profile>({})
    const { enqueueSnackbar } = useSnackbar()
    const intl = useIntl()
    const dispatch = useDispatch()
    const currentProfile = useSelector((state: RootState) => state.profile)

    useEffect(() => {
        if (!auth?.currentUser?.uid) return
        const unsubscribe = onSnapshot(doc(firestore, 'profile', auth?.currentUser?.uid), (doc) => {
            const data = doc.data()
            data && setProfile(data)
            dispatch(setProfileRedux(data || currentProfile))
        })
        return () => unsubscribe()
    }, [])

    const saveProfile = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault()
        if (!auth?.currentUser?.uid) return
        setLoading(true)
        try {
            await setDoc(doc(firestore, 'profile', auth?.currentUser?.uid), profile)
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Saved.profile',
            }), { variant: 'success' })
            setLoading(false)
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.saving',
            }), { variant: 'error', persist: true })
            setLoading(false)
        }
    }, [profile])
    return { saveProfile, loading, profile, setProfile }
}

export default useProfile