import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    padding: {
        padding: 2
      },
    paddingTop: {
        paddingTop: 2
    },
    wrap: {
        width: 400,
        padding: 2,
        overflowY: 'auto',
        maxHeight: '100%'
    },
    modal: {
        padding: 2,
        width: '400px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    paddingBottom: {
        paddingBottom: 1
    },
    row: {
        marginTop: 2,
        marginBottom: 2
    },
}

export default sx