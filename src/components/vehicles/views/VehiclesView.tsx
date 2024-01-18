import { useState, useEffect, FC } from 'react'
import Table from '@/components/common/Table/Table'
import {
    TextField,
    CircularProgress,
    Box,
    Typography,
    InputAdornment,
    Paper,
    Button,
    SvgIcon,
} from '@mui/material'

import { Search } from '@mui/icons-material'

import EditVehicle from '@/components/vehicles/components/EditVehicle/EditVehicle'
import AddVehicleWithButton from '@/components/vehicles/components/AddVehicleWithButton/AddVehicleWithButton'
import sx from '../styles/Vehicles.sx'
import { Vehicles, VehicleProps } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Group } from '@/components/common/Group/Group'
import { useRouter } from 'next/router'

export const VehiclesView: FC<VehicleProps> = ({
    vehicles,
    vehicleId,
    edit,
    searchRef,
    fuse,
    columns,
    routeId,
    drivers,
    trailers,
}): JSX.Element => {
    const intl = useIntl()
    const router = useRouter()
    const [search, setSearch] = useState<string | boolean>(false)
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicles>(vehicles)
    useEffect(() => {
        if (search && typeof search === 'string' && search.length >= 3) {
            const tempVehicles = fuse.search(search)
            setFilteredVehicles(tempVehicles.map((s) => s.item))
        } else {
            setFilteredVehicles(vehicles)
        }
    }, [search, vehicles])

    if (
        vehicles?.[0]?.key === 'loading' ||
        drivers?.[0]?.key === 'loading' ||
        trailers?.[0]?.key === 'loading'
    ) {
        return (
            <Box sx={sx.loading}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={sx.header}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                >
                    <TextField
                        variant="outlined"
                        placeholder={intl.formatMessage({ id: 'app.Search' })}
                        size="small"
                        onChange={(e) => setSearch(e.target.value)}
                        sx={sx.search}
                        inputRef={searchRef}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Paper sx={sx.searchKey} elevation={2}>
                                        <Typography variant="caption">
                                            /
                                        </Typography>
                                    </Paper>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Group type="vehicle" />
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                >
                    <Button
                        onClick={() => router.push('/trailers')}
                        startIcon={
                            <SvgIcon>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 632 448"
                                >
                                    <path d="M 64 48 L 496 48 Q 511 49 512 64 L 512 304 L 275 304 Q 262 282 241 269 Q 219 256 192 256 Q 165 256 143 269 Q 122 282 109 304 L 64 304 Q 49 303 48 288 L 48 64 Q 49 49 64 48 L 64 48 Z M 288 352 L 616 352 Q 638 350 640 328 Q 638 306 616 304 L 560 304 L 560 64 Q 559 37 541 19 Q 523 1 496 0 L 64 0 Q 37 1 19 19 Q 1 37 0 64 L 0 288 Q 1 315 19 333 Q 37 351 64 352 L 96 352 Q 97 393 124 420 Q 151 447 192 448 Q 233 447 260 420 Q 287 393 288 352 L 288 352 Z M 136 80 Q 114 82 112 104 L 112 200 Q 114 222 136 224 Q 158 222 160 200 L 160 104 Q 158 82 136 80 L 136 80 Z M 232 80 Q 210 82 208 104 L 208 200 Q 210 222 232 224 Q 254 222 256 200 L 256 104 Q 254 82 232 80 L 232 80 Z M 328 80 Q 306 82 304 104 L 304 248 Q 306 270 328 272 Q 350 270 352 248 L 352 104 Q 350 82 328 80 L 328 80 Z M 424 80 Q 402 82 400 104 L 400 248 Q 402 270 424 272 Q 446 270 448 248 L 448 104 Q 446 82 424 80 L 424 80 Z M 144 352 Q 145 325 168 310 Q 192 298 216 310 Q 239 325 240 352 Q 239 379 216 394 Q 192 406 168 394 Q 145 379 144 352 L 144 352 Z" />
                                </svg>
                            </SvgIcon>
                        }
                    >
                        <FormattedMessage id="app.Trailers" />
                    </Button>
                    <AddVehicleWithButton />
                </Box>
            </Box>
            {Array.isArray(vehicles) && filteredVehicles.length > 0 && (
                <Table
                    stickyHeader
                    columns={columns}
                    data={filteredVehicles}
                    name="vehicles"
                />
            )}
            {Array.isArray(filteredVehicles) &&
                filteredVehicles.length === 0 && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        style={{ height: 'calc(100vh - 54px - 72px)' }}
                    >
                        <Typography variant="h5" sx={sx.padding}>
                            <FormattedMessage id="app.noVehicles" />
                        </Typography>
                    </Box>
                )}
            <EditVehicle
                vehicle={vehicles.find((v) => v.key === vehicleId)}
                edit={edit}
                routeId={routeId}
            />
        </Box>
    )
}
