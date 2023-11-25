import { useState, useEffect, useCallback } from 'react'
import { Vehicle } from '../../../types'
import { auth, firestore } from '@/services/firebase'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { Maintenance, Maintenances } from '@/components/maintenance/types'
import { useEditVehicleResponse } from '../types'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { setVehicleMaintenance } from '@/components/maintenance/redux'
import { setRoutes } from '../../../../routes/redux'
import useFiles from '@/hooks/useFiles'
import { Route } from '../../../../routes/types'
import { collection, deleteDoc, updateDoc, addDoc, doc, where, query, onSnapshot } from 'firebase/firestore'

const useEditVehicle = (vehicle: Vehicle | undefined): useEditVehicleResponse => {
    const [editedVehicle, setEditedVehicle] = useState<Vehicle | undefined>(vehicle)
    const maintenance = useSelector((state: RootState) => state.vehicleMaintenance)
    const routes = useSelector((state: RootState) => state.routes)
    const router = useRouter()
    const intl = useIntl()
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar()
    const { downloadFile, deleteFile } = useFiles()
    useEffect(() => setEditedVehicle(vehicle), [vehicle])
    const files = JSON.parse(editedVehicle?.files || '[]')

    useEffect(() => {
        if (!auth.currentUser?.uid || !vehicle?.key) {
            return
        }
        const qs = query(collection(firestore, 'maintenance'), where('vehicleId', '==', vehicle?.key))
        const unsubscribeMaintenance = onSnapshot(qs, (querySnapshot) => {
            const maintenance: Maintenances = []
            querySnapshot.forEach((doc) => {
                maintenance.push({key: doc.id, ...doc.data()})
            })
            dispatch(setVehicleMaintenance(maintenance))
        }, (error) => enqueueSnackbar(error.message, { variant: 'error', persist: true }))
        const qr = query(collection(firestore, 'routes'), where('vehicleId', '==', vehicle?.key))
        const unsubscribeRoutes = onSnapshot(qr, (querySnapshot) => {
            const routes: Route[] = []
            querySnapshot.forEach((doc) => {
                routes.push({key: doc.id, ...doc.data()})
            })
            dispatch(setRoutes(routes))
        }, (error) => enqueueSnackbar(error.message, { variant: 'error', persist: true }))
        return () => {
            unsubscribeMaintenance()
            unsubscribeRoutes()
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
        // TODO: delete the vehicle and write a function for clearing the db and storage
    }, [vehicle?.key])

    const addMaintenance = useCallback(
        async (m: Maintenance) => {
            if (!vehicle?.key || !auth?.currentUser?.uid) return
            try {
                await addDoc(collection(firestore, 'maintenance'), { ...m, userId: auth.currentUser.uid, vehicleId: vehicle?.key})
                enqueueSnackbar(
                    intl.formatMessage({
                        id: 'app.Saved.maintenance',
                    }),
                    { variant: 'success' }
                )
            } catch (error) {
                enqueueSnackbar(
                    intl.formatMessage({
                        id: 'app.Error.saving',
                    }),
                    { variant: 'error', persist: true }
                )
            }
        },
        [vehicle?.key]
    )

    return { saveVehicleField, editedVehicle, setEditedVehicle, reset, downloadFile, deleteFile, deleteVehicle, addMaintenance, maintenance, routes, files }
}

export default useEditVehicle