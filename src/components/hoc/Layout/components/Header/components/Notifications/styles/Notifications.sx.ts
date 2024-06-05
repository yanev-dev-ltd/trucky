import { BorderColor, BorderStyle } from '@mui/icons-material'
import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    notifications: {
        position: 'relative'
    },
    notificationsCount: {
        position: 'absolute',
        top: '-2px',
        left: 'calc(100% - 20px)',
        zIndex: 10,
        backgroundColor: 'primary.main',
        fontSize: 12,
        padding: '0 6px',
        borderRadius: 100,
        color: '#fff',
        fontWeight: 'bold',
        borderColor: 'background.paper',
        borderStyle: 'solid',
        borderSize: '2px'
    },
    notificationsList: {
        width: 320,
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
        '& path': {
            color: '#fff',
        }
    },
    itemNew: {
        padding: 0,
        paddingBottom: 1,
        paddingTop: 1,
        width: '100%',
        backgroundColor: 'primary.main',
        '& *': {
            color: '#fff',
        },
    },
    time: {
        fontSize: 11,
        wordWrap: 'break-word',
        maxWidth: '100%',
        textAlign: 'left',
        paddingTop: 1,
        display: 'block',
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
        position: 'relative',
        paddingTop: 1,
    },
    light: {
        backgroundColor: '#fff',
        '& path': {
            color: 'primary.main',
        }
    },
    dot: {
        backgroundColor: 'primary.main',
        width: 6,
        height: 6,
        borderRadius: 100,
        position: 'absolute',
        top: '26px',
        left: 8,
    }
}

export default sx