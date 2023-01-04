import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    form: {
        width: 420
    },
    row: {
        paddingTop: 1,
        paddingBottom: 1
    },
    warn: {
      backgroundColor: 'danger.main',
      marginRight: 'auto',
      color: '#fff',
      '&:hover': {
          backgroundColor: 'danger.dark'
      }
    },
}

export default sx