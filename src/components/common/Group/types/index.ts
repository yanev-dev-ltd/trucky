import { MouseEvent } from 'react'

export type useGroupProps = {
    type: keyof typeof GroupType
}

export enum GroupType {
    vehicle = 'vehicle',
    driver = 'driver',
    client = 'client',
    route = 'route',
    trailer = 'trailer',
    order = 'order'
}

export type Group = {
    key?: string
    name?: string
    type?: GroupType
    description?: string
    userId?: string
    new?: string
}

export type GroupProps = {
    groups: Group[]
    anchorEl: HTMLButtonElement | null
    handleClose: () => void
    handleClick: (event: MouseEvent<HTMLButtonElement>) => void
    editGroupIndex: number | null
    setEditGroupIndex: (index: number | null) => void
    editGroup: () => void
    editedGroup?: Group
    setEditedGroup: (group: Group | undefined) => void
    editLoading: boolean
    deleteGroup: () => void
    type: keyof typeof GroupType
}