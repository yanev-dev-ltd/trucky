import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useSelect from './hooks/useSelect'
import SelectView from './views/SelectView'
import { useSelectProps } from './types'

export const Select: FC<useSelectProps> = wrap(SelectView, useSelect)
