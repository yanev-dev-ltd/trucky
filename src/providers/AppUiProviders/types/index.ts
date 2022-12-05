import { PaletteMode } from '../../../styles/theme'

export type Settings = {
    theme: PaletteMode | undefined
    locale: string | undefined
    units: string | undefined
}