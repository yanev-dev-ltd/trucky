import {
    useState,
    ReactNode,
    ReactElement,
    PropsWithChildren,
    MouseEvent,
    forwardRef,
} from 'react'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import {
    Table as MuiTable,
    MenuItem,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Menu,
    FormControlLabel,
    Checkbox,
    Box,
    Tooltip,
} from '@mui/material'
import { useIntl } from 'react-intl'
import { useTable, useSortBy } from 'react-table'
import { TableVirtuoso } from 'react-virtuoso'
import sx from './styles/Table.sx'
import { TableProps } from './types'

type MouseState = {
    mouseX: number | null
    mouseY: number | null
}

const initialState = {
    mouseX: null,
    mouseY: null,
}

export function Table<T extends Record<string, unknown>>(
    props: PropsWithChildren<TableProps<T>>
): ReactElement {
    const intl = useIntl()
    const { columns, data, name, height = 'calc(100vh - 126px)' } = props
    const {
        getTableProps,
        headerGroups,
        rows,
        prepareRow,
        allColumns,
        getTableBodyProps,
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    )
    const [mouseState, setMouseState] = useState<MouseState>(initialState)

    const handleClick = (event: MouseEvent) => {
        event.preventDefault()
        setMouseState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        })
    }

    const handleClose = () => {
        setMouseState(initialState)
    }

    return (
        <>
            <Menu
                keepMounted
                open={mouseState.mouseY !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    mouseState.mouseY !== null && mouseState.mouseX !== null
                        ? { top: mouseState.mouseY, left: mouseState.mouseX }
                        : undefined
                }
            >
                {allColumns.map((column) => {
                    if (column.id === 'details') return null
                    return (
                        <MenuItem key={column.id}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...column.getToggleHiddenProps()}
                                    />
                                }
                                label={column.Header as ReactNode}
                            />
                        </MenuItem>
                    )
                })}
            </Menu>
            <TableVirtuoso
                style={{ height }}
                totalCount={rows.length}
                useWindowScroll
                overscan={90000}
                components={{
                    Table: ({ style, ...props }) => (
                        <MuiTable
                            {...getTableProps()}
                            {...props}
                            style={{
                                ...style,
                                width: '100%',
                                tableLayout: 'fixed',
                            }}
                            id={name}
                            onContextMenu={handleClick}
                        />
                    ),
                    TableBody: forwardRef(({ style, ...props }, ref) => {
                        return (
                            <TableBody
                                {...getTableBodyProps()}
                                {...props}
                                ref={ref}
                            />
                        )
                    }),
                    TableRow: (props) => {
                        const index = props['data-index']
                        const row = rows[index]
                        const { key, ...rest } = row.getRowProps()
                        return (
                            <TableRow
                                key={key}
                                {...props}
                                {...rest}
                                sx={sx.row}
                            />
                        )
                    },
                    TableHead,
                }}
                fixedHeaderContent={() => {
                    return headerGroups.map((headerGroup) => {
                        const { key, ...rest } =
                            headerGroup.getHeaderGroupProps()
                        return (
                            <TableRow key={key} {...rest}>
                                {headerGroup.headers.map((column) => {
                                    const { key, ...rest } =
                                        column.getHeaderProps({
                                            ...column.getSortByToggleProps(),
                                            style: {
                                                maxWidth: column.maxWidth,
                                                width: column.width,
                                            },
                                        })
                                    return (
                                        <TableCell
                                            key={key}
                                            {...rest}
                                            sx={{
                                                backgroundColor:
                                                    'background.default',
                                                boxShadow: (theme) =>
                                                    `inset 0px -1px 0 0 ${theme.palette.divider}`,
                                            }}
                                        >
                                            <Tooltip
                                                title={
                                                    column.canSort
                                                        ? intl.formatMessage({
                                                              id: 'app.Sort',
                                                          })
                                                        : undefined
                                                }
                                                placement="bottom-start"
                                            >
                                                <Box
                                                    sx={
                                                        column.isSorted
                                                            ? sx.sorted
                                                            : sx.root
                                                    }
                                                >
                                                    {column.render('Header')}
                                                    <Box
                                                        component="span"
                                                        sx={sx.sort}
                                                    >
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <ArrowDropDown
                                                                    fontSize="small"
                                                                    style={{
                                                                        marginBottom:
                                                                            '-5px',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <ArrowDropUp
                                                                    fontSize="small"
                                                                    style={{
                                                                        marginBottom:
                                                                            '-5px',
                                                                    }}
                                                                />
                                                            )
                                                        ) : (
                                                            <ArrowDropUp
                                                                fontSize="small"
                                                                style={{
                                                                    visibility:
                                                                        'hidden',
                                                                    marginBottom:
                                                                        '-5px',
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Tooltip>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })
                }}
                itemContent={(index, user) => {
                    const row = rows[index]
                    prepareRow(row)
                    return row.cells.map((cell) => {
                        const { key, ...rest } = cell.getCellProps({
                            style: {
                                maxWidth: cell.column.maxWidth,
                                width: cell.column.width,
                            },
                        })
                        return (
                            <TableCell key={key} {...rest}>
                                {cell.render('Cell')}
                            </TableCell>
                        )
                    })
                }}
            />
        </>
    )
}

export default Table
