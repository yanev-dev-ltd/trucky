import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useSelectRoute from './hooks/useSelectRoute'
import SelectRouteView from './views/SelectRouteView'
import { useSelectRouteProps } from './types'

export const SelectRoute: FC<useSelectRouteProps> = wrap(
    SelectRouteView,
    useSelectRoute
)
