import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    loginContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    submit: {
        marginTop: 2,
    },
    modal: {
        padding: 2,
        width: '400px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
}

export default sx
