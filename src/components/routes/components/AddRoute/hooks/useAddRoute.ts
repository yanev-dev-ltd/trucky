import { useState, useEffect } from 'react'
import { Driver } from '@/components/drivers/types'

import { Route } from '../types'


const useAddRoute = () => {
    const [route, setRoute] = useState<Route>({})
    const changeField = (field: string, value: string | Driver[]) => {
        setRoute((oldRoute) => oldRoute ? { ...oldRoute, [field]: value } : { [field]: value })
    }
    return {
        route,
        changeField,
    }
}

export default useAddRoute