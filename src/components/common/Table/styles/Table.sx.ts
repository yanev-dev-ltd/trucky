import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    root: {
        color: 'text.secondary',
        userSelect: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        paddingRight: 1
    },
}

export default sx