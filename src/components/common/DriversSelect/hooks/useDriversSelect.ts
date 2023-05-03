import { useDriversSelectProps } from '../types'
import allDrivers from '@/api/drivers'

const useDriversSelect = ({ drivers, setDrivers }: useDriversSelectProps) => {
    return { drivers, setDrivers, allDrivers }
}

export default useDriversSelect