import { useLayoutEffect, useRef, useState } from 'react'
import {
    Dialog,
    Box,
    DialogContent,
    Typography,
    FormControl,
    TextField,
    Autocomplete,
    DialogActions,
    Button,
    IconButton,
    Tooltip,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { AddRouteProps } from './types'
import sx from './sx/AddRoute.sx'
import useAddRoute from './hooks/useAddRoute'
import allDrivers from '@/api/drivers'

const AddRoute = ({ vehicleId }: AddRouteProps) => {
    const { route, changeField } = useAddRoute()
    const router = useRouter()
    const mapRef = useRef(null)
    const [reload, setReload] = useState(false)

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
            defaultLayers.vector.normal.map,
            {
                center: { lat: 50, lng: 5 },
                zoom: 4,
                pixelRatio: window.devicePixelRatio || 1,
            }
        )

        const behavior = new H.mapevents.Behavior(
            new H.mapevents.MapEvents(hMap)
        )

        const ui = H.ui.UI.createDefault(hMap, defaultLayers)

        const handleResize = () => {
            hMap.getViewPort().resize()
        }

        window.addEventListener('resize', handleResize)

        // This will act as a cleanup to run once this hook runs again.
        // This includes when the component un-mounts
        return () => {
            hMap.dispose()
            window.removeEventListener('resize', handleResize)
            // console.log('here')
        }
    }, [mapRef, reload])
    return (
        <Dialog open fullScreen>
            <Box component="form">
                <DialogContent sx={sx.dialog}>
                    <Box sx={sx.info}>
                        <Typography variant="h6">
                            <FormattedMessage id="app.AddRoute" />
                        </Typography>
                        <Box
                            sx={sx.row}
                            display="flex"
                            gap={1}
                            alignItems="flex-start"
                        >
                            <FormControl fullWidth variant="outlined">
                                <Autocomplete
                                    id="drivers"
                                    multiple
                                    options={allDrivers}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(_, values) =>
                                        changeField('drivers', values)
                                    }
                                    groupBy={(option) => option.name.charAt(0)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <FormattedMessage id="app.Drivers" />
                                            }
                                        />
                                    )}
                                />
                            </FormControl>
                            <Tooltip
                                title={<FormattedMessage id="app.AddDriver" />}
                            >
                                <IconButton sx={{ marginTop: 1 }}>
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={sx.row}>
                            <TextField
                                label={
                                    <FormattedMessage id="app.FuelConsumption" />
                                }
                                variant="outlined"
                                value={route.fuelConsumption || ''}
                                onChange={(event) =>
                                    changeField(
                                        'fuelConsumption',
                                        event.target.value
                                    )
                                }
                                fullWidth
                                type="number"
                            />
                        </Box>
                        <Box sx={sx.row}></Box>
                    </Box>
                    <Box
                        ref={mapRef}
                        sx={{
                            height: 'calc(100vh - 53px)',
                            width: '100%',
                            flexGrow: 1,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button sx={sx.left} variant="outlined">
                        <FormattedMessage id="app.Print" />
                    </Button>
                    <Button
                        onClick={() => router.push(`/vehicles/${vehicleId}`)}
                    >
                        <FormattedMessage id="app.Cancel" />
                    </Button>
                    <Button type="submit" color="primary" variant="contained">
                        <FormattedMessage id="app.AddRoute" />
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default AddRoute
