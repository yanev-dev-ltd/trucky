import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    modal: {
        padding: 2,
        width: '600px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    padding: {
        padding: (theme) => theme.spacing(0, 0, 2, 0)
    },
    table: {
        width: '100%'
    }
}

export default sx