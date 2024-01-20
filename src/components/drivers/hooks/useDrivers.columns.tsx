import { useMemo } from 'react'
import { Column } from 'react-table'
import { Driver } from '../types'
import { FormattedMessage } from 'react-intl'
import { Tooltip, IconButton } from '@mui/material'
import Overflow from '@/components/common/Overflow/Overflow'
import { FormatListBulleted } from '@mui/icons-material'
import Link from 'next/link'
import { GroupsView } from '@/components/common/Group/components/GroupsView/GroupsView'

const useDriversColumns = (drivers: Driver[]) => {
    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo<Column<Driver>[]>(
        () => [
            {
                Header: '',
                id: 'groups',
                accessor: (d: Driver) => <GroupsView groups={d.groups || []} />,
                width: 36,
            },
            {
                Header: <FormattedMessage id="app.Name" />,
                id: 'name',
                accessor: (d: Driver) =>
                    d.name ? <Overflow text={d.name} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Phone" />,
                id: 'phone',
                accessor: (d: Driver) =>
                    d.phone ? <Overflow text={d.phone} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Address" />,
                id: 'address',
                accessor: (d: Driver) =>
                    d.address ? <Overflow text={d.address} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Details" />,
                id: 'details',
                accessor: (v: Driver) => (
                    <Tooltip title={<FormattedMessage id="app.Details" />}>
                        <IconButton component={Link} href={`/drivers/${v.key}`}>
                            <FormatListBulleted />
                        </IconButton>
                    </Tooltip>
                ),
                disableSortBy: true,
            },
        ],
        [drivers]
    )

    return { columns }
}

export default useDriversColumns
