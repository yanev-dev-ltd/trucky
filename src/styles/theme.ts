import { createTheme, PaletteColor, PaletteColorOptions } from '@mui/material/styles'
import { blue, grey, red } from '@mui/material/colors';

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

export type PaletteMode = 'dark' | 'light' | undefined

export const theme = (mode: PaletteMode = 'light') => createTheme({
    palette: {
      mode,
      primary: {
        main: '#0a84ff'
      },
      secondary: {
        main: blue[300]
      },
      orange: {
        main: '#faebce',
        dark: '#f5c779'
      },
      green: {
        main: '#bbdfdb'
      },
      danger: {
        main: red[300]
      }
    },
  })