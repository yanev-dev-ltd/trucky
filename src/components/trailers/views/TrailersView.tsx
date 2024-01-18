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
} from '@mui/material'

import { Search } from '@mui/icons-material'

import EditTrailer from '@/components/trailers/components/EditTrailer/EditTrailer'
import AddTrailerWithButton from '@/components/trailers/components/AddTrailerWithButton/AddTrailerWithButton'
import sx from '../styles/Trailers.sx'
import { Trailers, TrailersProps } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Group } from '@/components/common/Group/Group'
import { useRouter } from 'next/router'

export const TrailersView: FC<TrailersProps> = ({
    trailers,
    trailerId,
    edit,
    searchRef,
    fuse,
    columns,
}): JSX.Element => {
    const intl = useIntl()
    const router = useRouter()
    const [search, setSearch] = useState<string | boolean>(false)
    const [filteredTrailers, setFilteredTrailers] = useState<Trailers>(trailers)
    useEffect(() => {
        if (search && typeof search === 'string' && search.length >= 3) {
            const tempTrailers = fuse.search(search)
            setFilteredTrailers(tempTrailers.map((s) => s.item))
        } else {
            setFilteredTrailers(trailers)
        }
    }, [search, trailers])

    if (trailers?.[0]?.key === 'loading') {
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
                    <Group type="trailer" />
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                >
                    <Button onClick={() => router.push('/vehicles')}>
                        <FormattedMessage id="app.Back" />
                    </Button>
                    <AddTrailerWithButton />
                </Box>
            </Box>
            {Array.isArray(trailers) && filteredTrailers.length > 0 && (
                <Table
                    stickyHeader
                    columns={columns}
                    data={filteredTrailers}
                    name="trailers"
                />
            )}
            {Array.isArray(filteredTrailers) &&
                filteredTrailers.length === 0 && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        style={{ height: 'calc(100vh - 54px - 72px)' }}
                    >
                        <Typography variant="h5" sx={sx.padding}>
                            <FormattedMessage id="app.noTrailers" />
                        </Typography>
                    </Box>
                )}
            <EditTrailer
                trailer={trailers.find((t) => t.key === trailerId)}
                edit={edit}
            />
        </Box>
    )
}
