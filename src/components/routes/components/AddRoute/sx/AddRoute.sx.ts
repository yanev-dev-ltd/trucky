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
    noLocations: {
        textAlign: 'center',
        padding: 2
    },
    icons: {
        width: '50px'
    },
    icon: {
        minWidth: '30px'
    },
    listItem: {
        minHeight: '60px'
    },
}

export default sx