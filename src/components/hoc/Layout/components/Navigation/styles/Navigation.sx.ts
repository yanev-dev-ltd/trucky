import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    root: {
      width: 100,
      backgroundColor: 'background.paper',
      color: 'text.primary',
      height: 'calc(100vh - 54px)',
      borderRadius: '0',
      overflowY: 'auto',
      padding: 0
    },
    list: {
      padding: 0
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        textDecoration: 'none'
      }
    },
    itemCurrent: {
      display: 'flex',
      flexDirection: 'column',
      color: 'primary.main',
      '& svg': {
        color: 'primary.main'
      }
    },
    icon: {
      color: 'text.primary',
      margin: '0 auto'
    }
}

export default sx