import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    padding: {
        padding: 2,
    },
    wrap: {
        width: 500,
        padding: 2,
        overflowY: 'auto',
        maxHeight: '100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
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
    paper: {
        padding: 1,
        marginTop: 2,
        position: 'relative',
    },
    edit: {
        position: 'absolute',
        top: 1,
        right: 1,
    },
    flexList: {
        display: 'flex',
        flexWrap: 'wrap',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        marginBottom: 1,
    },
    listLabel: {
        width: '30%',
        textAlign: 'right',
        backgroundColor: 'transparent'
    },
    listText: {
        width: '60%',
    },
    select: {
        marginTop: 2,
    },
    smallCell: {
        padding: 1,
    },
    smallCellHead: {
        color: 'text.secondary',
        padding: 1,
    },
    row: {
        padding: (theme) => `${theme.spacing(2)}px ${theme.spacing(0.5)}px`,
    },
    fileInput: {
        display: 'none',
    },
    link: {
        color: 'text.primary',
    },
    routesList: {
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
    relative: {
        position: 'relative',
        padding: (theme) => `${theme.spacing()}px 0`,
    },
    warn: {
        marginTop: 2,
        backgroundColor: 'danger.main',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'danger.dark'
        }
    },
    textWrap: {
        textOverflow: 'ellipsis',
        maxWidth: 440,
        overflow: 'hidden'
    }
}

export default sx