import { useMemo } from 'react'
import { Column } from 'react-table'
import { FormattedMessage, useIntl } from 'react-intl'
import { Tooltip, IconButton, Box, Typography } from '@mui/material'
import Overflow from '@/components/common/Overflow/Overflow'
import {
    Check,
    CloudDownload,
    Edit,
    NotificationsActive,
    NotificationsNone,
} from '@mui/icons-material'
import Link from 'next/link'
import { Document } from '@/components/common/Documents/types'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { capitalizeFirstLetter } from '@/utils/globalUtils'
import sx from '../styles/Documents.sx'
import useFiles from '@/components/common/Documents/hooks/useFiles'
import { format } from 'date-fns'

const useDocumentsColumns = (documents: Document[]) => {
    const intl = useIntl()
    const { downloadFile } = useFiles()
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const trailers = useSelector((state: RootState) => state.trailers)
    const drivers = useSelector((state: RootState) => state.drivers)
    const maintenances = useSelector((state: RootState) => state.maintenances)
    const clients = useSelector((state: RootState) => state.clients)
    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo<Column<Document>[]>(
        () => [
            {
                Header: '',
                id: 'reminder',
                accessor: (d: Document) =>
                    d.reminderDate ? (
                        d.status === 'completed' ? (
                            <Tooltip
                                title={`${intl.formatMessage({
                                    id: 'app.ReminderDateCompleted',
                                })}: ${format(d.reminderDate, 'dd/MM/yyyy')}`}
                            >
                                <Check />
                            </Tooltip>
                        ) : (
                            <Tooltip
                                title={`${intl.formatMessage({
                                    id: 'app.ReminderDate',
                                })}: ${format(d.reminderDate, 'dd/MM/yyyy')}`}
                            >
                                <NotificationsActive />
                            </Tooltip>
                        )
                    ) : (
                        <Tooltip
                            title={
                                <FormattedMessage id="app.Maintenance.NoAlarm" />
                            }
                        >
                            <NotificationsNone />
                        </Tooltip>
                    ),
                disableSortBy: true,
                width: 40,
            },
            {
                Header: <FormattedMessage id="app.Title" />,
                id: 'title',
                accessor: (d: Document) =>
                    d.title ? <Overflow text={d.title} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Name" />,
                id: 'name',
                accessor: (d: Document) =>
                    d.name ? <Overflow text={d.name} /> : '-',
                sortType,
            },
            {
                Header: (
                    <Box component={'span'} sx={sx.multiLineHeader}>
                        <FormattedMessage id="app.Unit" />
                        <Typography variant="caption">
                            <FormattedMessage id="app.Type" />
                        </Typography>
                    </Box>
                ),
                id: 'type',
                accessor: (d: Document) => {
                    let typeName = '-'
                    switch (d.type) {
                        case 'vehicle':
                            typeName =
                                vehicles.find((v) => v.key === d.typeId)
                                    ?.name || '-'
                            break
                        case 'trailer':
                            typeName =
                                trailers.find((t) => t.key === d.typeId)
                                    ?.name || '-'
                            break
                        case 'driver':
                            typeName =
                                drivers.find((dr) => dr.key === d.typeId)
                                    ?.name || '-'
                            break
                        case 'maintenance':
                            const maintenance = maintenances.find(
                                (m) => m.key === d.typeId
                            )
                            typeName =
                                `${maintenance?.type}, ${
                                    maintenance?.isTrailer
                                        ? intl.formatMessage({
                                              id: 'app.Trailer',
                                          })
                                        : intl.formatMessage({
                                              id: 'app.Vehicle',
                                          })
                                }: ${
                                    maintenance?.isTrailer
                                        ? trailers.find(
                                              (t) =>
                                                  t.key ===
                                                  maintenance.vehicleId
                                          )?.name || '-'
                                        : vehicles.find(
                                              (v) =>
                                                  v.key ===
                                                  maintenance?.vehicleId
                                          )?.name
                                }` || '-'
                            break
                        case 'client':
                            typeName =
                                clients.find((c) => c.key === d.typeId)?.name ||
                                '-'
                            break
                    }
                    return d.typeId ? (
                        <Box>
                            <Overflow text={typeName} />
                            <Overflow
                                variant="caption"
                                text={
                                    d?.type
                                        ? intl.formatMessage({
                                              id: `app.${capitalizeFirstLetter(
                                                  d.type
                                              )}s`,
                                          })
                                        : '-'
                                }
                            />
                        </Box>
                    ) : (
                        '-'
                    )
                },
                sortType,
            },
            {
                Header: <FormattedMessage id="app.DateAndHour" />,
                id: 'date',
                accessor: (d: Document) =>
                    d.date ? format(d.date, 'dd/MM/yyyy HH:mm') : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Actions" />,
                id: 'details',
                accessor: (d: Document) => (
                    <>
                        <Tooltip title={<FormattedMessage id="app.Edit" />}>
                            <IconButton
                                component={Link}
                                href={`/documents/${d.key}`}
                            >
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={<FormattedMessage id="app.Download" />}>
                            <IconButton onClick={() => downloadFile(d)}>
                                <CloudDownload />
                            </IconButton>
                        </Tooltip>
                    </>
                ),
                disableSortBy: true,
            },
        ],
        [documents, vehicles, trailers, drivers, maintenances, clients, intl]
    )

    return { columns }
}

export default useDocumentsColumns
