import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    container: {
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    },
}

export default sx
