import { useMemo } from 'react'
import { Column } from 'react-table'
import { Client } from '../types'
import { FormattedMessage } from 'react-intl'
import { Tooltip, IconButton } from '@mui/material'
import Overflow from '@/components/common/Overflow/Overflow'
import { FormatListBulleted } from '@mui/icons-material'
import Link from 'next/link'
import { GroupsView } from '@/components/common/Group/components/GroupsView/GroupsView'

const useClientsColumns = (clients: Client[]) => {
    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo<Column<Client>[]>(
        () => [
            {
                Header: '',
                id: 'groups',
                accessor: (c: Client) => <GroupsView groups={c.groups || []} />,
                width: 36,
            },
            {
                Header: <FormattedMessage id="app.Name" />,
                id: 'name',
                accessor: (c: Client) =>
                    c.name ? <Overflow text={c.name} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.ContactPerson" />,
                id: 'contactPerson',
                accessor: (c: Client) =>
                    c.contactPerson ? <Overflow text={c.contactPerson} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Phone" />,
                id: 'phone',
                accessor: (c: Client) =>
                    c.phone ? <Overflow text={c.phone} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Email" />,
                id: 'email',
                accessor: (c: Client) =>
                    c.email ? <Overflow text={c.email} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Address" />,
                id: 'address',
                accessor: (c: Client) =>
                    c.address ? <Overflow text={c.address} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Details" />,
                id: 'details',
                accessor: (c: Client) => (
                    <Tooltip title={<FormattedMessage id="app.Details" />}>
                        <IconButton component={Link} href={`/clients/${c.key}`}>
                            <FormatListBulleted />
                        </IconButton>
                    </Tooltip>
                ),
                disableSortBy: true,
            },
        ],
        [clients]
    )

    return { columns }
}

export default useClientsColumns
