import { useState, useLayoutEffect, useRef } from 'react'
import { Route } from '../types'


const useAddRoute = () => {
    const [route, setRoute] = useState<Route>({})
    const [distance, setDistance] = useState<number[]>([])
    const [toll, setToll] = useState<number[]>([])
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
    }
}

export default useAddRoute