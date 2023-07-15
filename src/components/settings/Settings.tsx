import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useSettings from './hooks/useSettings'
import { SettingsView } from './views/SettingsView'
import { useSettingsProps } from './types'

export const Settings: FC<useSettingsProps> = wrap(SettingsView, useSettings)
