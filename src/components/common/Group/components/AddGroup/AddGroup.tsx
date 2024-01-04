import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useAddGroup from './hooks/useAddGroup'
import AddGroupView from './views/AddGroupView'
import { useAddGroupProps } from './types'

export const AddGroup: FC<useAddGroupProps> = wrap(AddGroupView, useAddGroup)
