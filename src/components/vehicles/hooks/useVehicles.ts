import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'
import { RootState } from '../../../store/store'
import { db, auth } from '../../../services/firebase'
import { setVehicles } from '../redux'
import { snapshotToArray } from '../../../utils/globalUtils'
import { VehicleProps, useVehicleProps, Vehicle, VehicleTypes, FuelTypes } from '../types'
import Fuse from 'fuse.js'
import { useIntl } from 'react-intl'
import drivers from '../../../api/drivers'
import useVehiclesColumns from './useVehicles.columns'

const useVehicles =  ({ vehicleId, edit }:useVehicleProps): VehicleProps => {
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const intl = useIntl()
    const { columns } = useVehiclesColumns(vehicles)

    const fuse: Fuse<Vehicle> = new Fuse(vehicles, {
        keys: [
            'name',
            'mileage',
            'route',
            {
                name: 'driver',
                getFn: (d: Vehicle) =>
                    drivers.find((dr) => dr.id === d.driver)?.name +
                    ' ' +
                    drivers.find((dr) => dr.id === d.driver)?.phone,
            },
            {
                name: 'type',
                getFn: (t: Vehicle) =>
                    t.type
                        ? intl.formatMessage({
                              id: `app.VehicleType.${
                                  VehicleTypes[
                                      t.type as keyof typeof VehicleTypes
                                  ]
                              }`,
                          })
                        : '-',
            },
            {
                name: 'fuel',
                getFn: (t: Vehicle) =>
                    t.fuel
                        ? intl.formatMessage({
                              id: `app.FuelType.${
                                  FuelTypes[
                                      t.fuel as keyof typeof FuelTypes
                                  ]
                              }`,
                          })
                        : '-',
            },
        ],
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        minMatchCharLength: 3,
    })
    
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const unsubscribe = onValue(ref(db, 'vehicles/' + auth.currentUser?.uid), (snapshot) => {
            const snp = snapshot.val()
            dispatch(setVehicles(snp ? snapshotToArray(snp) : []))
        })
        return () => unsubscribe()
    }, [auth.currentUser?.uid])

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === '/') {
                event.preventDefault()
                searchRef.current?.focus()
            }
        }
        document.addEventListener('keydown', handleKeyPress)
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [])

    return { vehicles, vehicleId, edit, searchRef, fuse, columns }
}

export default useVehicles