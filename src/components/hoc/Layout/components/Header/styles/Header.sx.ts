import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    header: {
        padding: 1,
        backgroundColor: 'action.hover',
        height: 54,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        marginTop: 1,
        marginLeft: 1,
    },
    gray: {
        backgroundColor: 'action.selected'
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 1
    },
    time: {
        fontSize: 10,
        wordWrap: 'break-word',
        maxWidth: 50
    },
    link: {
        color: 'text.primary',
        textDecoration: 'none',
        display: 'block'
    }
}

export default sx