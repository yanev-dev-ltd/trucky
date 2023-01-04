import { createTheme, PaletteColor, PaletteColorOptions } from '@mui/material/styles'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import { blue, red } from '@mui/material/colors';

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

export const theme = (mode: PaletteMode = PaletteMode.Light) => createTheme({
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
			main: red[400],
			dark: red[700]
		}
    },
	components: {
		MuiAutocomplete: {
			styleOverrides: {
				listbox: {
					'&::-webkit-scrollbar': {
						width: '5px',
					},
					'&::-webkit-scrollbar-thumb': {
						background: '#999',
					},
				}
			}
		}
	}
  })