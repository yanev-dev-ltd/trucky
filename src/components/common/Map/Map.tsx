import { Box } from '@mui/material'
import useMap from './hooks/useMap'
import { MapProps } from './types'
const Map = ({ locations, sx, setDistance, setToll }: MapProps) => {
    const { mapRef } = useMap({ locations, setDistance, setToll })
    return <Box ref={mapRef} sx={sx} />
}

export default Map
