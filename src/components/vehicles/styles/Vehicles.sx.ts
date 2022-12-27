import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    padding: {
        padding: 2,
    },
    header: {
        padding: 2,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 54px)',
    },
    search: {
        width: 300
    },
    scroll: {
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