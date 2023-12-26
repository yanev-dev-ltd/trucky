import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    modal: {
        padding: 2,
        width: '400px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    box: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    padding: {
        padding: (theme) => theme.spacing(0, 0, 2, 0)
    },
    warn: {
        backgroundColor: 'danger.main',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'danger.dark',
        }
    }
}

export default sx