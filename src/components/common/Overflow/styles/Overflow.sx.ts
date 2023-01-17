import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    root: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
    text: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block'
    }
}

export default sx