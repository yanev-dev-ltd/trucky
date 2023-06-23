import { useState, useEffect, useCallback } from 'react'
import { Vehicle } from '../../../types'
import { db, auth } from '@/services/firebase'
import { ref, update, remove, push, set, onValue, equalTo, orderByChild, query } from 'firebase/database'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { Service } from '../../../types'
import { useEditVehicleResponse } from '../types'
import { useSelector, useDispatch } from 'react-redux'
import { snapshotToArray } from '@/utils/globalUtils'
import { RootState } from '@/store/store'
import { setVehicleService } from '../redux'
import { setRoutes } from '../../../../routes/redux'
import useFiles from '@/hooks/useFiles'

const useEditVehicle = (vehicle: Vehicle | undefined): useEditVehicleResponse => {
    const [editedVehicle, setEditedVehicle] = useState<Vehicle | undefined>(vehicle)
    const service = useSelector((state: RootState) => state.vehicleService)
    const routes = useSelector((state: RootState) => state.routes)
    const router = useRouter()
    const intl = useIntl()
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar()
    const { downloadFile, deleteFile } = useFiles()
    useEffect(() => setEditedVehicle(vehicle), [vehicle])

    useEffect(() => {
        if (!auth.currentUser?.uid || !vehicle?.key) {
            return
        }
        const unsubscribeService = onValue(query(ref(db, 'service/' + auth.currentUser?.uid), orderByChild('vehicle'), equalTo(vehicle.key)), (snapshot) => {
            const snp = snapshot.val()
            dispatch(setVehicleService(snp ? snapshotToArray(snp).sort((a,b) => b.date - a.date) : []))
        })
        const unsubscribeRoutes = onValue(query(ref(db, 'routes/' + auth.currentUser?.uid), orderByChild('vehicle'), equalTo(vehicle.key)), (snapshot) => {
            const snp = snapshot.val()
            dispatch(setRoutes(snp ? snapshotToArray(snp).sort(
                (a, b) =>
                    +(b.endDate || 0) - +(a.endDate || 0)
            ) : []))
        })
        return () => {
            unsubscribeService()
            unsubscribeRoutes()
        }
    }, [auth.currentUser?.uid, vehicle?.key])

    const saveVehicleField = useCallback((field: keyof Vehicle) => {
        if (!vehicle?.key || !auth?.currentUser?.uid) return
        try {
            update(ref(db, 'vehicles/' + auth?.currentUser?.uid + '/' + vehicle.key), {
                [field]: editedVehicle?.[field],
            })
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


    const deleteVehicle = useCallback(() => {
        if (!vehicle?.key || !auth?.currentUser?.uid) return
        try {
            remove(ref(db, 'vehicles/' + auth.currentUser.uid + '/' + vehicle?.key))
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

    const addService = useCallback(
        (s: Service) => {
            if (!vehicle?.key || !auth?.currentUser?.uid) return
            try {
                const postServiceRef = ref(db, 'service/' + auth.currentUser.uid)
                const newServiceRef = push(postServiceRef)
                set(
                    ref(
                        db,
                        'service/' + auth.currentUser.uid + '/' + newServiceRef.key
                    ),
                    {
                        ...s,
                        vehicle: vehicle?.key
                    }
                )
                enqueueSnackbar(
                    intl.formatMessage({
                        id: 'app.Saved.service',
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

    return { saveVehicleField, editedVehicle, setEditedVehicle, reset, downloadFile, deleteFile, deleteVehicle, addService, service, routes }
}

export default useEditVehicle