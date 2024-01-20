import { useMemo } from 'react'
import Link from 'next/link'
import { Column } from 'react-table'
import { Order } from '../types'
import { FormattedMessage } from 'react-intl'
import { Tooltip, IconButton } from '@mui/material'
import { FormatListBulleted } from '@mui/icons-material'
import Overflow from '@/components/common/Overflow/Overflow'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { GroupsView } from '@/components/common/Group/components/GroupsView/GroupsView'

const useOrdersColumns = (orders: Order[]) => {
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const allVehicles = useSelector((state: RootState) => state.vehicles)
    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo<Column<Order>[]>(
        () => [
            {
                Header: '',
                id: 'groups',
                accessor: (o: Order) =>
                    o.groups ? <GroupsView groups={o.groups} /> : null,
                width: 36,
            },
            {
                Header: <FormattedMessage id="app.Reference" />,
                id: 'reference',
                accessor: (o: Order) => (
                    <Overflow text={`${o?.reference || '-'}`} />
                ),
            },
            {
                Header: <FormattedMessage id="app.Vehicle" />,
                id: 'vehicle',
                accessor: (o: Order) => {
                    const v = allVehicles.find((v) => v.key === o.vehicleId)
                    return v?.name ? <Overflow text={v.name} /> : '-'
                },
                maxWidth: 240,
                sortType,
            },
            {
                Header: <FormattedMessage id="app.StartStop" />,
                id: 'startStop',
                accessor: (o: Order) => (
                    <Overflow text={`${o?.startStop?.address || '-'}`} />
                ),
            },
            {
                Header: <FormattedMessage id="app.EndStop" />,
                id: 'endStop',
                accessor: (o: Order) => (
                    <Overflow text={`${o?.endStop?.address || '-'}`} />
                ),
            },
            {
                Header: <FormattedMessage id="app.Details" />,
                id: 'details',
                accessor: (o: Order) => (
                    <Tooltip title={<FormattedMessage id="app.Details" />}>
                        <IconButton component={Link} href={`/orders/${o.key}`}>
                            <FormatListBulleted />
                        </IconButton>
                    </Tooltip>
                ),
                disableSortBy: true,
            },
        ],
        [orders, allDrivers, allVehicles]
    )

    return { columns }
}

export default useOrdersColumns
