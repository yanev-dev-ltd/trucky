import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 54px)'
    },
}

export default sx
