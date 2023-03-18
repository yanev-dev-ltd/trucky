import { Padding } from '@mui/icons-material'
import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    dialog: {
        margin: 0,
        padding: 0,
        height: 'calc(100vh - 53px)',
        display: 'flex',
        flexDirection: 'row',
    },
    info: {
        width: 420,
        backgroundColor: 'action.hover',
        padding: 1,
    },
    row: {
        marginTop: 1,
        marginBottom: 1,
    },
    left: {
        marginRight: 'auto'
    }
}

export default sx