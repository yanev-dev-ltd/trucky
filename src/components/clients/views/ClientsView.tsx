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
import sx from '../styles/Clients.sx'
import { Client, ClientsProps } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import AddClientWithButton from '../components/AddClientWithButton/AddClientWithButton'
import { EditClient } from '../components/EditClient/EditClient'
import { Group } from '@/components/common/Group/Group'

export const ClientsView: FC<ClientsProps> = ({
    clients,
    edit,
    clientId,
    searchRef,
    fuse,
    columns,
}): JSX.Element => {
    const intl = useIntl()
    const [search, setSearch] = useState<string | boolean>(false)
    const [filteredClients, setFilteredClients] = useState<Client[]>(clients)
    useEffect(() => {
        if (search && typeof search === 'string' && search.length >= 3) {
            const tempClients = fuse.search(search)
            setFilteredClients(tempClients.map((s) => s.item))
        } else {
            setFilteredClients(clients)
        }
    }, [search, clients])
    const client = clients.find((c) => c.key === clientId)

    if (clients?.[0]?.key === 'loading') {
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
                    <Group type="client" />
                </Box>
                <AddClientWithButton />
            </Box>
            {Array.isArray(clients) && filteredClients.length > 0 && (
                <Table
                    stickyHeader
                    columns={columns}
                    data={filteredClients}
                    name="clients"
                />
            )}
            {Array.isArray(filteredClients) && filteredClients.length === 0 && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    style={{ height: 'calc(100vh - 54px - 72px)' }}
                >
                    <Typography variant="h5" sx={sx.padding}>
                        <FormattedMessage id="app.NoClients" />
                    </Typography>
                </Box>
            )}
            <EditClient client={client || { key: '' }} edit={edit} />
        </Box>
    )
}

export default ClientsView
