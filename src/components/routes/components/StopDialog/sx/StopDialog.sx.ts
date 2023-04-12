import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    header: {
        width: 460,
        display: 'flex',
        justifyContent: 'space-between',
    },
    row: {
        marginTop: 1,
        marginBottom: 1,
        display: 'flex',
        justifyContent: 'space-between'
    },
    checkbox: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
    }
}

export default sx