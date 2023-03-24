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
        padding: 3
    },
    icons: {
        width: '50px'
    },
    icon: {
        minWidth: '30px'
    }
}

export default sx