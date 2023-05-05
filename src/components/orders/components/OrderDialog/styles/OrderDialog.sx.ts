import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    header: {
        width: 520,
        display: 'flex',
        justifyContent: 'space-between',
    },
    warn: {
        backgroundColor: 'danger.main',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'danger.dark'
        }
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    actionsRight: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    gap: {
        display: 'flex',
        gap: 1
    }
}

export default sx