import { useState, useEffect, useCallback } from 'react'
import { Service } from '../../../../../types'

const useNewService = () => {
    const [service, setService] = useState<Service>({
        cost: null,
        date: new Date().getTime(),
        driver: '',
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
            driver: '',
            mileage: null,
            place: '',
            reminderDate: null,
            reminderMileage: null,
            type: '',
            part: ''
        })
    }

    const setField = useCallback((field: string, value: string | number | null) => {
        setService((oldService) => {
            return {...oldService, [field]: value}
        })
    }, [])

    return { setField, service, reset }
}

export default useNewService