import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    paper: {
        padding: 1,
        marginTop: 2,
        position: 'relative',
    },
    fixedHeight: {
        maxHeight: 350,
        overflowY: 'auto',
        marginTop: 2,
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
    edit: {
        position: 'absolute',
        top: 1,
        right: 1,
    },
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
    item: {
        padding: 0
    },
    textWrap: {
        textOverflow: 'ellipsis',
        maxWidth: 340,
        overflow: 'hidden'
    }
}

export default sx