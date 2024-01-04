import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useGroup from './hooks/useGroup'
import { GroupView } from './views/GroupView'
import { useGroupProps } from './types'

export const Group: FC<useGroupProps> = wrap(GroupView, useGroup)
