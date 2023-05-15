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

// TODO: use react-virtualized

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
                {allColumns.map((column) => (
                    <MenuItem key={column.id}>
                        <FormControlLabel
                            control={
                                <Checkbox {...column.getToggleHiddenProps()} />
                            }
                            label={column.Header as ReactNode}
                        />
                    </MenuItem>
                ))}
            </Menu>
            <TableVirtuoso
                style={{ height }}
                totalCount={rows.length}
                useWindowScroll
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
                            onContextMenu={handleClick}
                        />
                    ),
                    TableBody: forwardRef(({ style, ...props }, ref) => (
                        <TableBody
                            {...getTableBodyProps()}
                            {...props}
                            ref={ref}
                        />
                    )),
                    TableRow: (props) => {
                        const index = props['data-index']
                        const row = rows[index]
                        return (
                            <TableRow
                                {...props}
                                {...row.getRowProps()}
                                sx={sx.row}
                            />
                        )
                    },
                    TableHead,
                }}
                fixedHeaderContent={() => {
                    return headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                    sx={{
                                        backgroundColor: 'background.default',
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
                                            <Box component="span" sx={sx.sort}>
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
                            ))}
                        </TableRow>
                    ))
                }}
                itemContent={(index, user) => {
                    const row = rows[index]
                    prepareRow(row)
                    return row.cells.map((cell) => {
                        return (
                            <TableCell
                                {...cell.getCellProps({
                                    style: {
                                        maxWidth: cell.column.maxWidth,
                                    },
                                })}
                            >
                                {cell.render('Cell')}
                            </TableCell>
                        )
                    })
                }}
            />
            {/* <MuiTable
                {...getTableProps()}
                onContextMenu={handleClick}
                id={name}
                {...props}
            >
                <TableHead>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                    title={undefined}
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
                                            <Box component="span" sx={sx.sort}>
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
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <TableRow {...row.getRowProps()} sx={sx.row}>
                                {row.cells.map((cell, indx) => {
                                    return (
                                        <TableCell
                                            {...cell.getCellProps({
                                                style: {
                                                    maxWidth:
                                                        cell.column.maxWidth,
                                                },
                                            })}
                                        >
                                            {cell.render('Cell')}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </MuiTable> */}
        </>
    )
}

export default Table
