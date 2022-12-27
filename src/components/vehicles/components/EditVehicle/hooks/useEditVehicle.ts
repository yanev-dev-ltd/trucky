import { useState, useEffect, useCallback } from 'react'
import { Vehicle } from '../../../types'
import { db, auth, storage } from '../../../../../services/firebase'
import { ref, update, remove } from 'firebase/database'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { saveAs } from 'file-saver'
import { ref as storageRef, deleteObject, getBlob } from 'firebase/storage'
import { VehicleFile } from '../../../types'
import { useEditVehicleResponse } from '../types'

const useEditVehicle = (vehicle: Vehicle | undefined): useEditVehicleResponse => {
    const [editedVehicle, setEditedVehicle] = useState<Vehicle | undefined>(vehicle)
    const router = useRouter()
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => setEditedVehicle(vehicle), [vehicle])

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
            }), { variant: 'error' })
        }
        router.push('/vehicles/' + vehicle.key)
    }, [editedVehicle])

    const reset = useCallback(() => {
        setEditedVehicle(vehicle)
    }, [setEditedVehicle, vehicle])

    const downloadFile = useCallback(async (f: VehicleFile) => {
        saveAs(await getBlob(storageRef(storage, f.path)), f.name)
    }, [])

    const deleteUploadedFile = useCallback(
        (f: VehicleFile) => {
            if (!vehicle || !vehicle.key || !auth?.currentUser?.uid || !vehicle?.files) return
            const desertRef = storageRef(storage, f.path)
            deleteObject(desertRef)
                .then(() => {
                    const files = vehicle?.files
                        ? vehicle?.files.filter((uf) => uf.path !== f.path)
                        : []
                    update(
                        ref(
                            db,
                            'vehicles/' +
                                auth?.currentUser?.uid +
                                '/' +
                                vehicle.key
                        ),
                        { files }
                    )
                    enqueueSnackbar(intl.formatMessage({
                        id: 'app.DeletedDocumentSuccess',
                    }), { variant: 'success' })
                })
                .catch(() => enqueueSnackbar(intl.formatMessage({
                    id: 'app.Error.deletingDocument',
                }), { variant: 'error' }))
        },
        [intl, vehicle]
    )

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
            }), { variant: 'error' })
        }
        router.push('/vehicles')
        // TODO: delete the vehicle and write a function for clearing the db and storage
    }, [vehicle?.key])

    return { saveVehicleField, editedVehicle, setEditedVehicle, reset, downloadFile, deleteUploadedFile, deleteVehicle }
}

export default useEditVehicle