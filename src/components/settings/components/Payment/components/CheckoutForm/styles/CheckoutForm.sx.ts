import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    wrapper: {
        // backgroundColor: '#333',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        marginBottom: 1,
        marginTop: 1,
        padding: 2,
        borderRadius: 1
    },
    fields: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    field: {
        width: '32%'
    }
}

export default sx