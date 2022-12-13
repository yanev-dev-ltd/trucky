import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    padding: {
        padding: 2,
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 54px)',
    }
}

export default sx