import { useState } from 'react'
import { Route } from '../types'


const useRoute = (routeId?: string) => {
    const [route, setRoute] = useState<Route>({})
    const [distance, setDistance] = useState<number[]>([])
    const [toll, setToll] = useState<number[]>([])
    const [ferry, setFerry] = useState<boolean[]>([])
    const [noRoute, setNoRoute] = useState<boolean>(false)
    const changeField = (field: string, value: any) => {
        setRoute((oldRoute) => oldRoute ? { ...oldRoute, [field]: value } : { [field]: value })
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
    }
}

export default useRoute