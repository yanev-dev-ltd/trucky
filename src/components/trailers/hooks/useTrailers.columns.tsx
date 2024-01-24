import { useMemo } from 'react'
import Link from 'next/link'
import { Column } from 'react-table'
import { Trailer, Trailers, TrailerTypes } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Typography, Box, Tooltip, IconButton } from '@mui/material'
import { FormatListBulleted } from '@mui/icons-material'
import Overflow from '@/components/common/Overflow/Overflow'
import { GroupsView } from '@/components/common/Group/components/GroupsView/GroupsView'

const useTrailersColumns = (trailers: Trailers) => {
    const intl = useIntl()
    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo<Column<Trailer>[]>(
        () => [
            {
                Header: '',
                id: 'groups',
                accessor: (t: Trailer) => (
                    <GroupsView groups={t.groups || []} />
                ),
                width: 36,
            },
            {
                Header: <FormattedMessage id="app.Name" />,
                id: 'name',
                accessor: (t: Trailer) => {
                    return t.name ? <Overflow text={t.name} /> : '-'
                },
                maxWidth: 240,
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Type" />,
                id: 'type',
                accessor: (v: Trailer) => (
                    <Overflow
                        text={
                            v.type
                                ? intl.formatMessage({
                                      id: `app.TrailerType.${v.type}`,
                                  })
                                : '-'
                        }
                    />
                ),
                sortType: (a: any, b: any, id: string) => {
                    if (!a?.original[id]) return 1
                    if (!b?.original[id]) return -1
                    if (
                        intl.formatMessage({
                            id: `app.TrailerType.${
                                TrailerTypes[
                                    a?.original[id] as keyof typeof TrailerTypes
                                ]
                            }`,
                        }) >
                        intl.formatMessage({
                            id: `app.TrailerType.${
                                TrailerTypes[
                                    b?.original[id] as keyof typeof TrailerTypes
                                ]
                            }`,
                        })
                    ) {
                        return 1
                    }
                    if (
                        intl.formatMessage({
                            id: `app.TrailerType.${
                                TrailerTypes[
                                    a?.original[id] as keyof typeof TrailerTypes
                                ]
                            }`,
                        }) <
                        intl.formatMessage({
                            id: `app.TrailerType.${
                                TrailerTypes[
                                    b?.original[id] as keyof typeof TrailerTypes
                                ]
                            }`,
                        })
                    ) {
                        return -1
                    }
                    return 0
                },
            },
            {
                Header: <FormattedMessage id="app.Mileage" />,
                id: 'mileage',
                accessor: (t: Trailer) => {
                    return t.mileage ? (
                        <Box display="flex" alignItems="baseline" gap={1}>
                            <Overflow text={t?.mileage} />
                            <Typography variant="caption">
                                {t?.units === 'km' ? (
                                    <FormattedMessage id="app.Km" />
                                ) : t?.units === 'm' ? (
                                    <FormattedMessage id="app.Mi" />
                                ) : (
                                    <FormattedMessage id="app.Hrs" />
                                )}
                            </Typography>
                        </Box>
                    ) : (
                        '-'
                    )
                },
                maxWidth: 160,
                sortType: (a: any, b: any, id: string) => {
                    if (isNaN(+a.original[id])) return 1
                    if (isNaN(+b.original[id])) return -1
                    if (a.original[id] > b.original[id]) {
                        return 1
                    }
                    if (a.original[id] < b.original[id]) {
                        return -1
                    }
                    return 0
                },
            },
            {
                Header: <FormattedMessage id="app.Details" />,
                id: 'details',
                accessor: (t: Trailer) => (
                    <Tooltip title={<FormattedMessage id="app.Details" />}>
                        <IconButton
                            component={Link}
                            href={`/trailers/${t.key}`}
                        >
                            <FormatListBulleted />
                        </IconButton>
                    </Tooltip>
                ),
                disableSortBy: true,
            },
        ],
        [trailers]
    )

    return { columns }
}

export default useTrailersColumns
