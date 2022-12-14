import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    padding: {
        padding: 2,
    },
    wrap: {
        width: 400,
        padding: 2,
        overflowY: 'auto',
        maxHeight: '100%',
    },
    paper: {
        padding: 1,
        backgroundColor: 'background.default',
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
        width: '40%',
        textAlign: 'right',
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
        '&::-webkit-scrollbar': {
            width: 5,
        },
        '&::-webkit-scrollbar-track': {
            background: 'background.default',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'text.secondary',
        },
    },
    relative: {
        position: 'relative',
        padding: (theme) => `${theme.spacing()}px 0`,
    },
    warn: {
        backgroundColor: 'danger.main',
    },
}

export default sx