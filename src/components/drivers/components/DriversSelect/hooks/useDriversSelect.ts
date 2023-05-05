import { useDriversSelectProps } from '../types'
import allDrivers from '@/api/drivers'

const useDriversSelect = ({ drivers, setDrivers, sx }: useDriversSelectProps) => {
    return { drivers, setDrivers, allDrivers, sx }
}

export default useDriversSelect