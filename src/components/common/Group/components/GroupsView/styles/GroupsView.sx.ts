import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    group: {
        position: 'relative'
    },
    noGroups: {
        textAlign: 'center',
    },
    groupsList: {
        width: 400,
        maxHeight: 600,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            width: '5px',
        },
        '&::-webkit-scrollbar-track': {
            background: (theme) => theme.palette.background.paper,
        },
        '&::-webkit-scrollbar-thumb': {
            background: (theme) => theme.palette.text.secondary,
        },
    },
    paper: {
        padding: 1,
        width: '100%',
    },
    row: {
        paddingTop: 1,
        paddingBottom: 1,
        width: '100%',
    },
    selected: {
        backgroundColor: (theme) => theme.palette.primary.main,
    },
    tooltip: {
        '& .MuiListItemText-secondary': {
            color: '#fff',
        },
    }
}

export default sx