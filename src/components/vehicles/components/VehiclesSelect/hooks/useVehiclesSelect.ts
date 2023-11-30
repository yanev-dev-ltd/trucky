import { Vehicle } from '@/components/vehicles/types'
import { useVehiclesSelectProps } from '../types'
import { RootState } from '@/store/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const useVehiclesSelect = ({ vehicles, setVehicles, sx, multiple }: useVehiclesSelectProps) => {
    const allVehicles = useSelector((state: RootState) => state.vehicles)

    const selectedValue = useMemo(() => {
        if (vehicles && multiple) {
            return allVehicles.filter((v: Vehicle) => vehicles.includes(v.key)) || []
        }
        return vehicles && allVehicles.find((v: Vehicle) => v.key === vehicles[0])
    }, [vehicles, allVehicles, multiple])

    return { vehicles: selectedValue, setVehicles, allVehicles, sx, multiple }
}

export default useVehiclesSelect