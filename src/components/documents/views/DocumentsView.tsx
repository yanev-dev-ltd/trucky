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
import sx from '../styles/Documents.sx'
import { DocumentsProps } from '../types'
import { Document } from '@/components/common/Documents/types'
import { FormattedMessage, useIntl } from 'react-intl'
import { EditDocument } from '@/components/common/Documents/components/EditDocument/EditDocument'

export const DocumentsView: FC<DocumentsProps> = ({
    documents,
    searchRef,
    fuse,
    columns,
    documentId,
}): JSX.Element => {
    const intl = useIntl()
    const [search, setSearch] = useState<string | boolean>(false)
    const [filteredDocuments, setFilteredDocuments] =
        useState<Document[]>(documents)
    useEffect(() => {
        if (search && typeof search === 'string' && search.length >= 3) {
            const tempDocuments = fuse.search(search)
            setFilteredDocuments(tempDocuments.map((d) => d.item))
        } else {
            setFilteredDocuments(documents)
        }
    }, [search, documents])

    if (documents?.[0]?.key === 'loading') {
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
                </Box>
            </Box>
            {Array.isArray(documents) && filteredDocuments.length > 0 && (
                <Table
                    stickyHeader
                    columns={columns}
                    data={filteredDocuments}
                    name="documents"
                />
            )}
            {Array.isArray(filteredDocuments) &&
                filteredDocuments.length === 0 && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        style={{ height: 'calc(100vh - 54px - 72px)' }}
                    >
                        <Typography variant="h5" sx={sx.padding}>
                            <FormattedMessage id="app.NoDocuments" />
                        </Typography>
                    </Box>
                )}
            <EditDocument
                editDocument={documents.find((d) => d.key === documentId)}
                redirectTo="/documents"
            />
        </Box>
    )
}

export default DocumentsView
