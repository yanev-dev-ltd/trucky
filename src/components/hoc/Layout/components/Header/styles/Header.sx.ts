import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    header: {
        padding: 1,
        borderBottom: (theme) => `1px solid ${theme.palette.background.paper}`,
        height: 54,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        marginTop: 1,
        marginLeft: 1,
    },
    notifications: {
        position: 'relative'
    },
    notificationsCount: {
        position: 'absolute',
        top: 0,
        right: 10,
        zIndex: 10,
        backgroundColor: 'danger.main',
        fontSize: 10,
        padding: '0 5px',
        borderRadius: 100,
        color: '#fff'
    },
    notificationsList: {
        width: 320
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