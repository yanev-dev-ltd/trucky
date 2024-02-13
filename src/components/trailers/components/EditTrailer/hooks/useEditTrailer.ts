import { useState, useEffect, useCallback } from 'react'
import { Trailer } from '../../../types'
import { auth, firestore } from '@/services/firebase'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { Maintenances, Maintenance } from '@/components/maintenance/types'
import { useEditTrailerResponse } from '../types'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { setMaintenances } from '@/components/maintenance/redux'
import { collection, deleteDoc, updateDoc, doc, where, query, onSnapshot, orderBy } from 'firebase/firestore'
import { Group } from '@/components/common/Group/types'
import { setGroups } from '@/components/common/Group/redux'

const useEditTrailer = (trailer: Trailer | undefined): useEditTrailerResponse => {
    const [editedTrailer, setEditedTrailer] = useState<Trailer | undefined>(trailer)
    const maintenances = useSelector((state: RootState) => state.maintenances)
    const router = useRouter()
    const intl = useIntl()
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => setEditedTrailer(trailer), [trailer])

    useEffect(() => {
        if (!auth.currentUser?.uid || !trailer?.key) {
            return
        }
        const qs = query(collection(firestore, 'maintenances'), where('vehicleId', '==', trailer?.key), orderBy('date', 'desc'))
        const unsubscribeMaintenance = onSnapshot(qs, (querySnapshot) => {
            const m: Maintenances = []
            querySnapshot.forEach((doc) => {
                m.push({...doc.data() as Maintenance, key: doc.id})
            })
            dispatch(setMaintenances(m))
        }, (error) => enqueueSnackbar(error.message, { variant: 'error', persist: true }))
        const qg = query(collection(firestore, 'groups'), where('userId', '==', auth.currentUser?.uid), where('type', '==', 'trailer'))
        const unsubscribeGroups = onSnapshot(qg, (querySnapshot) => {
            const groups: Group[] = []
            querySnapshot.forEach((doc) => {
                groups.push({key: doc.id, ...doc.data()})
            })
            dispatch(setGroups(groups))
        }, (error) => enqueueSnackbar(error.message, { variant: 'error', persist: true }))
        return () => {
            unsubscribeMaintenance()
            unsubscribeGroups()
        }
    }, [auth.currentUser?.uid, trailer?.key])

    const saveTrailerField = useCallback(async (field: keyof Trailer) => {
        if (!trailer?.key || !auth?.currentUser?.uid) return
        try {
            await updateDoc(doc(firestore, 'trailers', trailer.key), { [field]: editedTrailer?.[field]})
            enqueueSnackbar(intl.formatMessage({
                id: `app.Saved.${field}`,
            }), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.saving',
            }), { variant: 'error', persist: true })
        }
        router.push('/trailers/' + trailer.key)
    }, [editedTrailer])

    const reset = useCallback(() => {
        setEditedTrailer(trailer)
    }, [setEditedTrailer, trailer])


    const deleteTrailer = useCallback(async () => {
        if (!trailer?.key || !auth?.currentUser?.uid) return
        try {
            await deleteDoc(doc(firestore, 'trailers', trailer?.key))
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedTrailerSuccess',
            }), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedTrailerError',
            }), { variant: 'error', persist: true })
        }
        router.push('/trailers')
        // TODO: delete the vehicle and write a function for clearing the db and storage
    }, [trailer?.key])

    return { saveTrailerField, editedTrailer, setEditedTrailer, reset, deleteTrailer, maintenances }
}

export default useEditTrailer