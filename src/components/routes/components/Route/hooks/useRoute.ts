import { useState } from 'react'
import { Route } from '../types'
import useLocalStorage from '@/hooks/useLocalStorage'


const useRoute = (routeId?: string, drivers?: string[]) => {
    const [route, setRoute] = useLocalStorage('route', { drivers })
    const [distance, setDistance] = useState<number[]>([])
    const [toll, setToll] = useState<number[]>([])
    const [ferry, setFerry] = useState<boolean[]>([])
    const [noRoute, setNoRoute] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const changeField = (field: string, value: any) => {
        setRoute(route ? { ...route, [field]: value } : { [field]: value })
    }
    const clearRoute = () => {
        setRoute({})
    }

    return {
        route,
        changeField,
        distance,
        setDistance,
        toll,
        setToll,
        ferry,
        setFerry,
        setNoRoute,
        noRoute,
        loading,
        setLoading,
        clearRoute
    }
}

export default useRoute
