import { Box } from '@mui/material'
import useMap from './hooks/useMap'
import { MapProps } from './types'
const Map = ({ locations, sx }: MapProps) => {
    const { mapRef } = useMap({ locations })
    return <Box ref={mapRef} sx={sx} />
}

export default Map
