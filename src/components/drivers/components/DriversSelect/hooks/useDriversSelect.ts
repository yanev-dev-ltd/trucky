import { useDriversSelectProps } from '../types'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

const useDriversSelect = ({ drivers, setDrivers, sx }: useDriversSelectProps) => {
    const allDrivers = useSelector((state: RootState) => state.drivers)
    return { drivers, setDrivers, allDrivers, sx }
}

export default useDriversSelect