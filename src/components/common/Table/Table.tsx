import {
    useState,
    ReactNode,
    ReactElement,
    PropsWithChildren,
    MouseEvent,
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
} from '@mui/material'
import { useTable, useSortBy } from 'react-table'
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
    const { columns, data, name } = props
    const { getTableProps, headerGroups, rows, prepareRow, allColumns } =
        useTable(
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
            <MuiTable
                {...getTableProps()}
                onContextMenu={handleClick}
                id={name}
                {...props}
            >
                <TableHead>
                    {headerGroups.map((headerGroup, i) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                    sx={sx.root}
                                >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <ArrowDropUp
                                                    fontSize="small"
                                                    style={{
                                                        marginBottom: '-5px',
                                                    }}
                                                />
                                            ) : (
                                                <ArrowDropDown
                                                    fontSize="small"
                                                    style={{
                                                        marginBottom: '-5px',
                                                    }}
                                                />
                                            )
                                        ) : (
                                            <ArrowDropUp
                                                fontSize="small"
                                                style={{
                                                    visibility: 'hidden',
                                                    marginBottom: '-5px',
                                                }}
                                            />
                                        )}
                                    </span>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map((cell, indx) => {
                                    return (
                                        <TableCell {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </MuiTable>
        </>
    )
}

export default Table
