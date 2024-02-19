import { useState, useEffect, useCallback } from 'react'
import { Vehicle } from '../../../types'
import { auth, firestore } from '@/services/firebase'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { Maintenances, Maintenance } from '@/components/maintenance/types'
import { useEditVehicleResponse } from '../types'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { setMaintenances } from '@/components/maintenance/redux'
import { setRoutes } from '../../../../routes/redux'
import { Route } from '../../../../routes/types'
import { collection, deleteDoc, updateDoc, doc, where, query, onSnapshot, orderBy } from 'firebase/firestore'
import { Group } from '@/components/common/Group/types'
import { setGroups } from '@/components/common/Group/redux'

const useEditVehicle = (vehicle: Vehicle | undefined): useEditVehicleResponse => {
    const [editedVehicle, setEditedVehicle] = useState<Vehicle | undefined>(vehicle)
    const maintenances = useSelector((state: RootState) => state.maintenances)
    const routes = useSelector((state: RootState) => state.routes)
    const router = useRouter()
    const intl = useIntl()
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => setEditedVehicle(vehicle), [vehicle])

    useEffect(() => {
        if (!auth.currentUser?.uid || !vehicle?.key) {
            return
        }
        const qs = query(collection(firestore, 'maintenances'), where('vehicleId', '==', vehicle?.key), orderBy('date', 'desc'))
        const unsubscribeMaintenance = onSnapshot(qs, (querySnapshot) => {
            const m: Maintenances = []
            querySnapshot.forEach((doc) => {
                m.push({...doc.data() as Maintenance, key: doc.id})
            })
            dispatch(setMaintenances(m))
        }, (error) => enqueueSnackbar(error.message, { variant: 'error', persist: true }))
        const qr = query(collection(firestore, 'routes'), where('vehicleId', '==', vehicle?.key), orderBy('startDate', 'desc'))
        const unsubscribeRoutes = onSnapshot(qr, (querySnapshot) => {
            const routes: Route[] = []
            querySnapshot.forEach((doc) => {
                routes.push({key: doc.id, ...doc.data()})
            })
            dispatch(setRoutes(routes))
        }, (error) => enqueueSnackbar(error.message, { variant: 'error', persist: true }))
        const qg = query(collection(firestore, 'groups'), where('userId', '==', auth.currentUser?.uid), where('type', '==', 'vehicle'))
        const unsubscribeGroups = onSnapshot(qg, (querySnapshot) => {
            const groups: Group[] = []
            querySnapshot.forEach((doc) => {
                groups.push({key: doc.id, ...doc.data()})
            })
            dispatch(setGroups(groups))
        }, (error) => enqueueSnackbar(error.message, { variant: 'error', persist: true }))
        return () => {
            unsubscribeMaintenance()
            unsubscribeRoutes()
            unsubscribeGroups()
        }
    }, [auth.currentUser?.uid, vehicle?.key])

    const saveVehicleField = useCallback(async (field: keyof Vehicle) => {
        if (!vehicle?.key || !auth?.currentUser?.uid) return
        try {
            await updateDoc(doc(firestore, 'vehicles', vehicle.key), { [field]: editedVehicle?.[field]})
            enqueueSnackbar(intl.formatMessage({
                id: `app.Saved.${field}`,
            }), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.saving',
            }), { variant: 'error', persist: true })
        }
        router.push('/vehicles/' + vehicle.key)
    }, [editedVehicle])

    const reset = useCallback(() => {
        setEditedVehicle(vehicle)
    }, [setEditedVehicle, vehicle])


    const deleteVehicle = useCallback(async () => {
        if (!vehicle?.key || !auth?.currentUser?.uid) return
        try {
            await deleteDoc(doc(firestore, 'vehicles', vehicle?.key))
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedVehicleSuccess',
            }), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedVehicleError',
            }), { variant: 'error', persist: true })
        }
        router.push('/vehicles')
    }, [vehicle?.key])

    return { saveVehicleField, editedVehicle, setEditedVehicle, reset, deleteVehicle, maintenances, routes }
}

export default useEditVehicle