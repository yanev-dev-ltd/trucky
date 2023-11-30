import { useDriversSelectProps } from '../types'
import { RootState } from '@/store/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const useDriversSelect = ({ drivers, setDrivers, sx, multiple }: useDriversSelectProps) => {
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const selectedValue = useMemo(() => {
        if (drivers && multiple) {
            return allDrivers.filter((d) => drivers.includes(d.key)) || []
        }
        if (drivers && !multiple) return allDrivers.find((d) => d.key === drivers[0])
    }, [drivers, allDrivers, multiple])
    return { drivers: selectedValue, setDrivers, allDrivers, sx, multiple }
}

export default useDriversSelect