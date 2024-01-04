import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useGroupsSelect from './hooks/useGroupsSelect'
import GroupsSelectView from './views/GroupsSelectView'
import { useGroupsSelectProps } from './types'

export const GroupsSelect: FC<useGroupsSelectProps> = wrap(
    GroupsSelectView,
    useGroupsSelect
)
