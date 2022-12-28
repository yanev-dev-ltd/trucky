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
        paddingRight: 2
    }
}

export default sx