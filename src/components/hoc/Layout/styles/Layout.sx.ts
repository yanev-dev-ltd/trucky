import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    wrap: {
      display: 'flex',
      alignItems: 'stretch',
    },
    page: {
        flex: 1,
        height: 'calc(100vh - 54px)',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
            width: '5px',
        },
        '&::-webkit-scrollbar-track': {
            background: (theme) => theme.palette.background.default,
        },
        '&::-webkit-scrollbar-thumb': {
            background: (theme) => theme.palette.text.secondary,
        },
    }
}

export default sx