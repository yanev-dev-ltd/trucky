import { useState, useRef, useLayoutEffect } from 'react'
import { Location } from '@/components/routes/components/AddRoute/types'
import svgMarker from '@/constants/marker'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { useMapProps } from '../types'

const useMap = ({ locations, setDistance, setToll, setFerry}: useMapProps) => {
    const mapRef = useRef(null)
    const [reload, setReload] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const intl = useIntl()
    
    useLayoutEffect(() => {
        // `mapRef.current` will be `undefined` when this hook first runs; edge case that
        if ((!mapRef.current && !reload) || !window.H) {
            // some strange ref behavior needs to be reloaded
            setReload(true)
            return
        }
        const H = window.H
        const platform = new H.service.Platform({
            apikey: process.env.TRUCKY_HERE_API_KEY
        })
        const defaultLayers = platform.createDefaultLayers()
        const hMap = new H.Map(
            mapRef.current,
            defaultLayers.vector.normal.truck, //TODO: maptypes.vector.normal.map for cars
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
        
        // const ui = H.ui.UI.createDefault(hMap, defaultLayers)
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap))

        if(locations && locations.length > 0) {
            locations.map((location: Location, index: number) => {
                const icon = new H.map.Icon(
                        svgMarker
                            .replace('{LEFT}', index > 8 ? '7' : '12')
                            .replace('{NUMBER}', `${index + 1}`)
                    ),
                    marker = new H.map.Marker(
                        { lat: location.lat || 0, lng: location.lng || 0 },
                        { icon }
                    )
                hMap.addObject(marker)
            })
    
            const router = platform.getRoutingService(null, 8)
            const origin = [...locations].shift()
            const destination = [...locations].pop()
            if (origin && destination && (origin !== destination || locations.length > 2)) {
                router.calculateRoute(
                    {
                        origin: `${origin?.lat},${origin?.lng}`,
                        destination: `${destination?.lat},${destination?.lng}`,
                        // defines multiple waypoints p
                        ...((locations && locations.length > 2) && {via: new H.service.Url.MultiValueQueryParameter([
                            ...locations.filter((l, i) => i !== 0 && i !== (locations && locations.length - 1)).map((p) => `${p.lat},${p.lng}`),
                        ])}),
                        return: 'polyline,travelSummary,tolls',
                        currency: 'EUR',
                        'tolls[summaries]': 'total',
                        transportMode: 'truck',
                        spans: 'truckAttributes',
                    },
                    (result: any) => {
                        const sections = result?.routes[0]?.sections
                        const lineStrings: any[] = []
                        console.log(sections)
                        const distance: number[] = []
                        const toll: number[] = []
                        const ferry: boolean[] = []
                        if (!sections) {
                            enqueueSnackbar(intl.formatMessage({ id: 'app.CouldNotCalculateRoute'}), { variant: 'error', persist: true })
                            return
                        }
                        sections.forEach((section: any, index: number) => {
                            // convert Flexible Polyline encoded string to geometry
                            lineStrings.push(
                                H.geo.LineString.fromFlexiblePolyline(
                                    section.polyline
                                )
                            )
                            if (section?.transport.mode !== 'ferry') {
                                distance.push(Number(section?.travelSummary?.length))
                                toll.push(Number(section?.travelSummary?.tolls?.total?.value))
                            } else {
                                ferry[distance.length - 1 - ferry.length] = true
                            }
                        })

                        setDistance && setDistance(distance)
                        setToll && setToll(toll)
                        setFerry && setFerry(ferry)

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
                        // hMap.addLayer(defaultLayers.vector.normal.trafficincidents)
                    },
                    () => enqueueSnackbar(intl.formatMessage({ id: 'app.Error.LoadingRoute'}), { variant: 'error', persist: true, preventDuplicate: true })
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
    }, [mapRef, reload, locations])

    return { mapRef }
}

export default useMap