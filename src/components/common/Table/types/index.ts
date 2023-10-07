import { TableOptions, Column } from 'react-table'
export interface TableProps<T extends Record<string, unknown>> extends TableOptions<T> {
    name: string
    height?: string
    columns: Column<T>[]
}