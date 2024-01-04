import { SxProps, Theme } from '@mui/material'
import { Group, GroupType } from '../../../types'

export type useGroupsSelectProps = {
    groups?: string[],
    setGroups: (group: string[]) => void,
    sx?: SxProps<Theme>
    multiple?: boolean
    type: keyof typeof GroupType
}

export type GroupsSelectProps = {
    groups?: Group[] | Group,
    setGroups: (group: string[]) => void,
    allGroups: Group[],
    sx?: SxProps<Theme>
    multiple?: boolean
    type: keyof typeof GroupType
}