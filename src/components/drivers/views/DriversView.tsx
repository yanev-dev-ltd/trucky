import { useState, useEffect, FC } from 'react'
import Table from '@/components/common/Table/Table'
import {
    TextField,
    CircularProgress,
    Box,
    Typography,
    InputAdornment,
    Paper,
} from '@mui/material'

import { Search } from '@mui/icons-material'
import sx from '../styles/Drivers.sx'
import { Driver, DriversProps } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import AddDriverWithButton from '../components/AddDriverWithButton/AddDriverWithButton'
import { EditDriver } from '../components/EditDriver/EditDriver'

export const DriversView: FC<DriversProps> = ({
    drivers,
    edit,
    driverId,
    searchRef,
    fuse,
    columns,
}): JSX.Element => {
    const intl = useIntl()
    const [search, setSearch] = useState<string | boolean>(false)
    const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(drivers)
    useEffect(() => {
        if (search && typeof search === 'string' && search.length >= 3) {
            const tempDrivers = fuse.search(search)
            setFilteredDrivers(tempDrivers.map((s) => s.item))
        } else {
            setFilteredDrivers(drivers)
        }
    }, [search, drivers])
    const driver = drivers.find((v) => v.key === driverId)

    if (drivers?.[0]?.key === 'loading') {
        return (
            <Box sx={sx.loading}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={sx.header}>
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
                                    <Typography variant="caption">/</Typography>
                                </Paper>
                            </InputAdornment>
                        ),
                    }}
                />
                <AddDriverWithButton />
            </Box>
            {Array.isArray(drivers) && filteredDrivers.length > 0 && (
                <Table
                    stickyHeader
                    columns={columns}
                    data={filteredDrivers}
                    name="drivers"
                />
            )}
            {Array.isArray(filteredDrivers) && filteredDrivers.length === 0 && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    style={{ height: 'calc(100vh - 54px - 72px)' }}
                >
                    <Typography variant="h5" sx={sx.padding}>
                        <FormattedMessage id="app.noDrivers" />
                    </Typography>
                </Box>
            )}
            <EditDriver driver={driver || { key: '' }} edit={edit} />
        </Box>
    )
}

export default DriversView
