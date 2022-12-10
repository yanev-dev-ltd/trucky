import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    notifications: {
        position: 'relative'
    },
    notificationsCount: {
        position: 'absolute',
        top: 0,
        left: 'calc(100% - 16px)',
        zIndex: 10,
        backgroundColor: 'danger.main',
        fontSize: 10,
        padding: '0 5px',
        borderRadius: 100,
        color: '#fff'
    },
    notificationsList: {
        width: 320,
        maxHeight: 600,
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
    item: {
        padding: 0,
        paddingBottom: 1,
        paddingTop: 1,
        width: '100%',
    },
    time: {
        fontSize: 10,
        wordWrap: 'break-word',
        maxWidth: '100%',
        paddingRight: 1,
        paddingLeft: 1,
        textAlign: 'center'
    },
    link: {
        color: 'text.primary',
        textDecoration: 'none',
        display: 'flex',
        width: '100%',
        '&:hover': {
            backgroundColor: 'action.selected'
        }
    },
    avatar: {
        color: 'text.primary',
        textDecoration: 'none',
        display: 'flex',
        width: 86,
        flexDirection: 'column',
        alignItems: 'center',
    },
}

export default sx