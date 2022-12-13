import { TableOptions } from 'react-table'
export interface TableProps<T extends Record<string, unknown>> extends TableOptions<T> {
    name: string
}