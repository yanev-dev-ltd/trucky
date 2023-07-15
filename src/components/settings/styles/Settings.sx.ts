import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    root: {
        display: 'flex',
        minHeight: '100%'
    },
    menu: {
        minWidth: 300,
        borderRadius: 0
    },
    section: {
        flexGrow: 1,
        padding: 2
    },
    active: {
        color: (theme) => theme.palette.primary.main,
        '& svg': {
            color: (theme) => theme.palette.primary.main
        }
    }
}

export default sx