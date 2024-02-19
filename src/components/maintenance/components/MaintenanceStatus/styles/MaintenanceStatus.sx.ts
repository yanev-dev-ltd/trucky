import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    tooltip: {
        '& .MuiListItemText-secondary': {
            color: '#fff',
        },
    }
}

export default sx