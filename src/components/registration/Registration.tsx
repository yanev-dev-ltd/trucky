import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useRegistration from './hooks/useRegistration'
import { RegistrationView } from './views/RegistrationView'
import { useRegistrationProps } from './types'

export const Registration: FC<useRegistrationProps> = wrap(
    RegistrationView,
    useRegistration
)
