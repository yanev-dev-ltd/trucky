import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    dialog: {
        width: 400,
        maxHeight: '60vh',
        overflowY: 'auto',  
        '&::-webkit-scrollbar': {
            width: '5px',
        },
        '&::-webkit-scrollbar-track': {
            background: (theme) => theme.palette.background.default,
        },
        '&::-webkit-scrollbar-thumb': {
            background: (theme) => theme.palette.text.secondary,
        },   
    },
    itewm: {
        padding: 0
    },
    textWrap: {
        textOverflow: 'ellipsis',
        maxWidth: 340,
        overflow: 'hidden'
    }
}

export default sx