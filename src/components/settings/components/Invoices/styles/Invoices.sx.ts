import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    padding: {
        padding: (theme) => theme.spacing(0, 0, 2, 0)
    },
    table: {
        width: '100%'
    },
    icon: {
        marginBottom: '-5px'
    },
    actions: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        gap: 1
    }
}

export default sx