import { PaletteMode } from '../types/theme'

export type Settings = {
    theme: PaletteMode
    locale: Locales
    units: string
    currency: string
    sound: string
}

export enum Locales {
    en = "en",
    bg = "bg"
}