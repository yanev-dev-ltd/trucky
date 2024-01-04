import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useManageGroups from './hooks/useManageGroups'
import { ManageGroupsView } from './views/ManageGroupsView'
import { useManageGroupsProps } from './types'

export const ManageGroups: FC<useManageGroupsProps> = wrap(
    ManageGroupsView,
    useManageGroups
)
