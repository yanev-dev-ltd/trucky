import { GroupType } from '../../../types'
export type useAddGroupProps = {
    onSave: (driverId: string) => void
    setOpen: (open: boolean) => void
    open: boolean | string
    changeField?: (field: string, value: string) => void
    newGroup?: NewGroup | undefined
    newGroupLoading?: boolean
    type: keyof typeof GroupType
}

export type AddGroupProps = {
    save: () => void
    setOpen: (open: boolean) => void
    open: boolean | string
    changeField: (field: string, value: string) => void
    newGroup?: NewGroup | undefined
    newGroupLoading?: boolean
}

export type NewGroup = {
    name?: string
    description?: string
}