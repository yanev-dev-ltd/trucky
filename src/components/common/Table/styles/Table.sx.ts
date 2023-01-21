import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    root: {
        color: 'text.secondary',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        paddingRight: 1
    },
    row: {
        ':hover': {
            backgroundColor: 'action.hover',
        }
    }
}

export default sx