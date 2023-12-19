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
import sx from '../styles/Maintenance.sx'
import { Maintenance, MaintenanceProps } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import { AddMaintenance } from '../components/AddMaintenance/AddMaintenance'
import { EditMaintenance } from '../components/EditMaintenance/EditMaintenance'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export const MaintenanceView: FC<MaintenanceProps> = ({
    maintenances,
    edit,
    maintenanceId,
    searchRef,
    fuse,
    columns,
}): JSX.Element => {
    const intl = useIntl()
    const [search, setSearch] = useState<string | boolean>(false)
    const [filteredMaintenances, setFilteredMaintenances] =
        useState<Maintenance[]>(maintenances)
    const { settings } = useSelector((state: RootState) => state.settings)
    useEffect(() => {
        if (search && typeof search === 'string' && search.length >= 3) {
            const tempMaintenances = fuse.search(search)
            setFilteredMaintenances(tempMaintenances.map((s) => s.item))
        } else {
            setFilteredMaintenances(maintenances)
        }
    }, [search, maintenances])
    const maintenance = maintenances.find((v) => v.key === maintenanceId)

    if (maintenances?.[0]?.key === 'loading') {
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
                <AddMaintenance units={settings.units} fullButton />
            </Box>
            {Array.isArray(filteredMaintenances) &&
                filteredMaintenances.length > 0 && (
                    <Table
                        stickyHeader
                        columns={columns}
                        data={filteredMaintenances}
                        name="maintenances"
                    />
                )}
            {Array.isArray(filteredMaintenances) &&
                filteredMaintenances.length === 0 && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        style={{ height: 'calc(100vh - 54px - 72px)' }}
                    >
                        <Typography variant="h5" sx={sx.padding}>
                            <FormattedMessage id="app.NoMaintenances" />
                        </Typography>
                    </Box>
                )}
            {maintenance && (
                <EditMaintenance maintenance={maintenance} edit={edit} />
            )}
        </Box>
    )
}

export default MaintenanceView
