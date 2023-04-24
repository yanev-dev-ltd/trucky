import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useOrderDialog from './hooks/useOrderDialog'
import OrderDialogView from './views/OrderDialogView'
import { useOrderDialogProps } from './types'

export const OrderDialog: FC<useOrderDialogProps> = wrap(
    OrderDialogView,
    useOrderDialog
)
