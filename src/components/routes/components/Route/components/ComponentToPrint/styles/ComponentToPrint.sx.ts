import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    print: {
        display: 'none',
        '@media print': {
            display: 'block',
            padding: 2,
            color: 'black',
            fontSize: '1rem',
        },
        'svg': {
            fill: 'black',
        }
    },
    label: {
        color: '#888'
    }
}

export default sx