import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useRoutes from './hooks/useRoutes'
import { RoutesView } from './views/RoutesView'
import { useRoutesProps } from './types'

export const Routes: FC<useRoutesProps> = wrap(RoutesView, useRoutes)
