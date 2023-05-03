import { Box, CircularProgress } from '@mui/material'
import useMap from './hooks/useMap'
import { MapProps } from './types'
const Map = ({
    locations,
    sx,
    setDistance,
    setToll,
    setFerry,
    setNoRoute,
}: MapProps) => {
    const { mapRef, loading } = useMap({
        locations,
        setDistance,
        setToll,
        setFerry,
        setNoRoute,
    })
    return (
        <Box ref={mapRef} sx={{ ...sx, position: 'relative' }}>
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, .5)',
                        zIndex: 9999999,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </Box>
    )
}

export default Map
