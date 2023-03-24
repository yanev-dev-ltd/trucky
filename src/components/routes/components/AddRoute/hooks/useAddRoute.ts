import { useState, useLayoutEffect, useRef } from 'react'
import { Driver } from '@/components/drivers/types'
import { Route, Location } from '../types'
import svgMarker from '@/constants/marker'


const useAddRoute = () => {
    const [route, setRoute] = useState<Route>({})
    const mapRef = useRef(null)
    const [reload, setReload] = useState(false)
    const changeField = (field: string, value: any) => {
        setRoute((oldRoute) => oldRoute ? { ...oldRoute, [field]: value } : { [field]: value })
    }

    useLayoutEffect(() => {
        // `mapRef.current` will be `undefined` when this hook first runs; edge case that
        if (!mapRef.current && !reload) {
            // some strange ref behavior needs to be reloaded
            setReload(true)
            return
        }
        const H = window.H
        const platform = new H.service.Platform({
            apikey: process.env.TRUCKY_HERE_API_KEY,
        })
        const defaultLayers = platform.createDefaultLayers()
        const hMap = new H.Map(
            mapRef.current,
            defaultLayers.vector.normal.truck,
            {
                center: { lat: 50, lng: 5 },
                zoom: 4,
                pixelRatio: window.devicePixelRatio || 1,
                padding: {
                    top: 40,
                    left: 40,
                    right: 40,
                    bottom: 40,
                },
            }
        )

        if(route.locations && route.locations.length > 0) {
            route.locations.map((location, index) => {
                const icon = new H.map.Icon(
                        svgMarker
                            .replace('{LEFT}', index > 8 ? '7' : '12')
                            .replace('{NUMBER}', `${index + 1}`)
                    ),
                    marker = new H.map.Marker(
                        { lat: location.lat, lng: location.lng },
                        { icon: icon }
                    )
                hMap.addObject(marker)
            })
    
            const router = platform.getRoutingService(null, 8)
            const origin = [...route.locations].shift()
            const destination = [...route.locations].pop()
            if (origin && destination) {
                router.calculateRoute(
                    {
                        origin: `${origin?.lat},${origin?.lng}`,
                        destination: `${destination?.lat},${destination?.lng}`,
                        // defines multiple waypoints p
                        ...((route.locations && route.locations.length > 2) && {via: new H.service.Url.MultiValueQueryParameter([
                            ...route.locations.filter((l, i) => i !== 0 || i !== (route.locations && route.locations.length - 1)).map((p) => `${p.lat},${p.lng}`),
                        ])}),
                        // returns route shape as a polyline in response
                        return: 'polyline',
                        transportMode: 'truck',
                        spans: 'truckAttributes',
                    },
                    (result: any) => {
                        const sections = result?.routes[0]?.sections
                        const lineStrings: any[] = []
                        if (!sections) alert('can not calculate route')
                        sections.forEach((section: any) => {
                            // convert Flexible Polyline encoded string to geometry
                            lineStrings.push(
                                H.geo.LineString.fromFlexiblePolyline(
                                    section.polyline
                                )
                            )
                        })
                        const multiLineString = new H.geo.MultiLineString(
                            lineStrings
                        )
                        const bounds = multiLineString.getBoundingBox()
                        // render route on the map
                        hMap.addObject(
                            new H.map.Polyline(multiLineString, {
                                style: { lineWidth: 5 },
                            })
                        )
                        // zoom to polyline
                        hMap.getViewModel().setLookAtData({ bounds })
                    },
                    console.error
                )
            }
        }

        const handleResize = () => {
            hMap.getViewPort().resize()
        }

        window.addEventListener('resize', handleResize)

        // This will act as a cleanup to run once this hook runs again.
        // This includes when the component un-mounts
        return () => {
            hMap.dispose()
            window.removeEventListener('resize', handleResize)
        }
    }, [mapRef, reload, route.locations])
    return {
        route,
        changeField,
        mapRef,
    }
}

export default useAddRoute