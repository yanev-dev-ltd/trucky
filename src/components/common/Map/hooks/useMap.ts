import { useState, useRef, useEffect } from 'react'
import { Location } from '@/components/routes/types'
import svgMarker from '@/constants/marker'
import { useSnackbar, SnackbarKey } from 'notistack'
import { useIntl } from 'react-intl'
import { useMapProps } from '../types'
import { KM_to_MILES } from '@/constants/units'
import H from '@here/maps-api-for-javascript'

const useMap = ({ locations, changeField, setNoRoute, mode = 'truck', currency = 'EUR', units = 'km'}: useMapProps) => {
    const mapRef = useRef<HTMLElement>(null)
    const map = useRef<any>(null)
    const platform = useRef<any>(null)
    const message = useRef<SnackbarKey>()
    const [loading, setLoading] = useState<boolean>(false)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const intl = useIntl()

    useEffect(() => {
        // Check if the map object has already been created
        if (!map.current && mapRef.current) {
            // Create a platform object with the API key and useCIT option
            platform.current = new H.service.Platform({
                apikey: process.env.TRUCKY_HERE_API_KEY || ''
            });
            // Obtain the default map types from the platform object:
            const defaultLayers = platform.current.createDefaultLayers({
                pois: true
            });
            // Create a new map instance with the Tile layer, center and zoom level
            // Instantiate (and display) a map:
            const newMap = new H.Map(
                mapRef.current,
                defaultLayers.vector.normal[mode === 'truck' ? 'truck' : 'map'], {
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
            );

            // Add panning and zooming behavior to the map
            const behavior = new H.mapevents.Behavior(
                new H.mapevents.MapEvents(newMap)
            );

            // Set the map object to the reference
            map.current = newMap;
        }

        if(locations && locations.length > 1 && map.current && platform.current && mapRef.current) {
            locations.map((location: Location, index: number) => {
                const icon = new H.map.DomIcon(
                        svgMarker
                            .replace('{LEFT}', index > 8 ? '7' : '12')
                            .replace('{NUMBER}', `${index + 1}`)
                    ),
                    marker = new H.map.DomMarker(
                        { lat: location.lat || 0, lng: location.lng || 0 },
                        { icon, data: { lat: location.lat || 0, lng: location.lng || 0 }}
                    )
                map.current.addObject(marker)
            })

            const router = platform.current.getRoutingService(null, 8)
            const origin = [...locations].shift()
            const destination = [...locations].pop()
            if (origin) {
                setLoading && setLoading(true)
                router.calculateRoute(
                    {
                        origin: `${origin?.lat},${origin?.lng}`,
                        destination: `${destination?.lat},${destination?.lng}`,
                        // defines multiple waypoints
                        ...((locations && locations.length > 2) && {via: new H.service.Url.MultiValueQueryParameter([
                            ...locations.filter((l, i) => i !== 0 && i !== (locations && locations.length - 1)).map((p) => `${p.lat},${p.lng}`),
                        ])}),
                        return: 'polyline,travelSummary,tolls,routeLabels',
                        currency,
                        'tolls[summaries]': 'total',
                        transportMode: mode,
                    },
                    (result: any) => {
                        const sections = result?.routes[0]?.sections
                        const lineStrings: any[] = []
                        const distance: number[] = []
                        const toll: number[] = []
                        const ferry: boolean[] = []
                        setLoading && setLoading(false)
                        if (!sections) {
                            setNoRoute && setNoRoute(true)
                            message.current = enqueueSnackbar(intl.formatMessage({ id: 'app.CouldNotCalculateRoute'}), { variant: 'error', persist: true })
                            return
                        }
                        setNoRoute && setNoRoute(false)
                        closeSnackbar(message.current)
                        sections.forEach((section: any) => {
                            // convert Flexible Polyline encoded string to geometry
                            lineStrings.push(
                                H.geo.LineString.fromFlexiblePolyline(
                                    section.polyline
                                )
                            )
                            if (section.departure.place.originalLocation) {
                                distance.push(Number(units === 'm' ? Math.round(section?.travelSummary?.length * KM_to_MILES) : section?.travelSummary?.length))
                                toll.push(Number(section?.travelSummary?.tolls?.total?.value))
                                ferry.push(false)
                            } else {
                                distance[distance.length - 1] += Number(units === 'm' ? Math.round(section?.travelSummary?.length * KM_to_MILES) : section?.travelSummary?.length)
                                toll[toll.length - 1] += Number(section?.travelSummary?.tolls?.total?.value)
                            }
                            
                            if (section?.transport.mode === 'ferry') {
                                ferry[distance.length - 1] = true
                            }
                        })

                        // changeField('distance', distance)
                        // changeField('toll', toll)
                        // changeField('ferry', ferry)

                        const multiLineString = new H.geo.MultiLineString(
                            lineStrings
                        )
                        const bounds = multiLineString.getBoundingBox()
                        // render route on the map
                        map.current.addObject(
                            new H.map.Polyline(multiLineString)
                        )
                        // zoom to polyline
                        map.current.getViewModel().setLookAtData({ bounds })
                        // hMap.addLayer(defaultLayers.vector.normal.trafficincidents)
                    },
                    () => {
                        setNoRoute && setNoRoute(true)
                        message.current = enqueueSnackbar(intl.formatMessage({ id: 'app.Error.LoadingRoute'}), { variant: 'error', persist: true, preventDuplicate: true })
                        setLoading && setLoading(false)
                    }
                )
            }
        }

        const handleResize = () => {
            if (map.current) {
                map.current.getViewPort().resize()
            }
        }

        window.addEventListener('resize', handleResize)

        // This will act as a cleanup to run once this hook runs again.
        // This includes when the component un-mounts
        return () => {
            // if (map.current) {
            //     map.current.dispose()
            // }
            window.removeEventListener('resize', handleResize)
        }
    }, [mapRef, locations, mode, currency, units, setNoRoute, changeField, intl, enqueueSnackbar, closeSnackbar, setLoading])

    return { mapRef, loading }
}

export default useMap