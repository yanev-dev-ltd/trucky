import { useCallback } from 'react'
import { createTheme } from '@mui/material/styles'
import { blue, red } from '@mui/material/colors'
import { PaletteMode } from '../types/theme'

const useTheme = () => {
    const theme = useCallback((mode: PaletteMode) => createTheme({
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
    }), [])

    return { theme }
}

export default useTheme