import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    root: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        // textOverflow: 'ellipsis',
    },
    text: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block'
    }
}

export default sx