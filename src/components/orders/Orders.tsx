import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useOrders from './hooks/useOrders'
import { OrdersView } from './views/OrdersView'
import { useOrdersProps } from './types'

export const Orders: FC<useOrdersProps> = wrap(OrdersView, useOrders)
