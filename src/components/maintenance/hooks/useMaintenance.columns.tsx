import { useMemo } from 'react'
import { Column } from 'react-table'
import { Maintenance } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import {
    Tooltip,
    IconButton,
    Box,
    Typography,
    List,
    ListItemText,
    Divider,
} from '@mui/material'
import Overflow from '@/components/common/Overflow/Overflow'
import {
    Check,
    FormatListBulleted,
    NotificationsActive,
    NotificationsNone,
} from '@mui/icons-material'
import Link from 'next/link'
import { Vehicle } from '@/components/vehicles/types'
import { format } from 'date-fns'
import { Trailer } from '@/components/trailers/types'
import sx from '../styles/Maintenance.sx'

const useMaintenanceColumns = (
    maintenance: Maintenance[],
    vehicles: Vehicle[],
    trailers: Trailer[]
) => {
    const intl = useIntl()
    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo<Column<Maintenance>[]>(
        () => [
            {
                Header: <FormattedMessage id="app.Status" />,
                id: 'status',
                accessor: (m: Maintenance) => (
                    <Tooltip
                        title={
                            (m.status !== 'completed' && m.reminderMileage) ||
                            (m.reminderDate &&
                                m.reminderDate > new Date().getTime()) ? (
                                <List disablePadding>
                                    {m.status != 'completed' &&
                                        m.reminderMileage && (
                                            <ListItemText
                                                secondary={
                                                    <FormattedMessage id="app.Maintenance.AlarmMileage" />
                                                }
                                            />
                                        )}
                                    {m.status != 'completed' &&
                                        m.reminderDate &&
                                        m.reminderDate >
                                            new Date().getTime() && (
                                            <Divider component="li" />
                                        )}
                                    {m.reminderDate &&
                                        m.reminderDate >
                                            new Date().getTime() && (
                                            <ListItemText
                                                secondary={
                                                    <FormattedMessage id="app.Maintenance.AlarmDate" />
                                                }
                                            />
                                        )}
                                </List>
                            ) : m.status === 'completed' ? (
                                <FormattedMessage id="app.Maintenance.Completed" />
                            ) : (
                                <FormattedMessage id="app.Maintenance.NoAlarm" />
                            )
                        }
                    >
                        {(m.status !== 'completed' && m.reminderMileage) ||
                        (m.reminderDate &&
                            m.reminderDate > new Date().getTime()) ? (
                            <NotificationsActive />
                        ) : m.status === 'completed' ? (
                            <Check />
                        ) : (
                            <NotificationsNone />
                        )}
                    </Tooltip>
                ),
            },
            {
                Header: (
                    <Box component={'span'} sx={sx.multiLineHeader}>
                        <FormattedMessage id="app.Vehicle" />
                        <Typography variant="caption">
                            <FormattedMessage id="app.Type" />
                        </Typography>
                    </Box>
                ),
                id: 'vehicle',
                accessor: (m: Maintenance) => {
                    const v = !m.isTrailer
                        ? vehicles.find((v) => v.key === m.vehicleId)
                        : trailers.find((t) => t.key === m.vehicleId)
                    return m.vehicleId ? (
                        <Box>
                            <Overflow text={v?.name || '-'} />
                            <Overflow
                                text={
                                    v?.type
                                        ? intl.formatMessage({
                                              id: !m.isTrailer
                                                  ? `app.VehicleType.${v.type}`
                                                  : `app.TrailerType.${v.type}`,
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
                Header: <FormattedMessage id="app.Date" />,
                id: 'date',
                accessor: (m: Maintenance) =>
                    m.date ? format(new Date(+m.date), 'dd/MM/yyyy') : '-',
            },
            {
                Header: <FormattedMessage id="app.Type" />,
                id: 'type',
                accessor: (m: Maintenance) =>
                    m.type ? <Overflow text={m.type} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Description" />,
                id: 'description',
                accessor: (m: Maintenance) =>
                    m.description ? <Overflow text={m.description} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Details" />,
                id: 'details',
                accessor: (v: Maintenance) => (
                    <Tooltip title={<FormattedMessage id="app.Details" />}>
                        <IconButton
                            component={Link}
                            href={`/maintenance/${v.key}`}
                        >
                            <FormatListBulleted />
                        </IconButton>
                    </Tooltip>
                ),
                disableSortBy: true,
            },
        ],
        [maintenance, vehicles, trailers]
    )

    return { columns }
}

export default useMaintenanceColumns
