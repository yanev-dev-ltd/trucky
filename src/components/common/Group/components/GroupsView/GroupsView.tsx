import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useGroupsView from './hooks/useGroupsView'
import GroupsViewView from './views/GroupsViewView'
import { useGroupsViewProps } from './types'

export const GroupsView: FC<useGroupsViewProps> = wrap(
    GroupsViewView,
    useGroupsView
)
