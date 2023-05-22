import { useState, useCallback } from 'react'
import { Service } from '../../../../../types'
import { Driver } from '@/components/drivers/types'

const useNewService = (drivers: string[]) => {
    const [service, setService] = useState<Service>({
        cost: null,
        date: new Date().getTime(),
        drivers: drivers,
        mileage: null,
        place: '',
        reminderDate: null,
        reminderMileage: null,
        type: '',
        part: ''
    })

    const reset = () => {
        setService({
            cost: null,
            date: new Date().getTime(),
            drivers: drivers,
            mileage: null,
            place: '',
            reminderDate: null,
            reminderMileage: null,
            type: '',
            part: ''
        })
    }

    const setField = useCallback((field: string, value: string | number | null | string[]) => {
        setService((oldService) => {
            return {...oldService, [field]: value}
        })
    }, [])

    return { setField, service, reset }
}

export default useNewService