import { PaletteColor, PaletteColorOptions } from '@mui/material/styles'
declare module '@mui/material/styles' {
    interface Palette {
        orange: PaletteColor
        green: PaletteColor
        danger: PaletteColor
    }
    interface PaletteOptions {
        orange: PaletteColorOptions
        green: PaletteColorOptions
        danger: PaletteColorOptions
    }
}

export enum PaletteMode { 
  Dark = 'dark',
  Light = 'light'
}