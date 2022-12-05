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
    }
}

export default sx
