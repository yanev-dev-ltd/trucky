import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    wrap: {
      display: 'flex',
      alignItems: 'stretch'
    },
    page: {
        flex: 1,
        height: 'calc(100vh - 54px)',
        overflow: 'auto',
    }
}

export default sx