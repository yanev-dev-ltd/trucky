import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    dialog: {
        width: 400, 
    },
    warn: {
        backgroundColor: 'danger.main',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'danger.dark'
        }
    }
}

export default sx