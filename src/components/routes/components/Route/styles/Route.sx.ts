import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    dialog: {
        margin: 0,
        padding: 0,
        height: 'calc(100vh - 53px)',
        display: 'flex',
        flexDirection: 'row',
    },
    info: {
        width: 420,
        backgroundColor: 'action.hover',
        padding: 1,
        height: 'calc(100vh - 53px)',
        overflow: 'auto',
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
    row: {
        marginTop: 1,
        marginBottom: 1,
    },
    left: {
        marginRight: 'auto'
    },
    locations: {
        padding: 1,
    },
    locationsHeader: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    orders: {
        padding: 1,
    },
    ordersHeader: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    noLocations: {
        textAlign: 'center',
        padding: 2
    },
    noOrders: {
        textAlign: 'center',
        padding: 2
    },
    icons: {
        maxWidth: '48px',
        minWidth: '48px',
        padding: 0,
        gap: 0,
        display: 'flex',
        flexWrap: 'wrap',
        ' svg': {
            width: 20,
            height: 20
        }
    },
    icon: {
        minWidth: '30px'
    },
    listItem: {
        minHeight: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 0,
    },
    loading: {
        position: 'absolute',
        zIndex: 99999999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255, .6)'
    }
}

export default sx