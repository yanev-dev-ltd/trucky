import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    root: {
      height: 'calc(100vh - 54px)',
      marginRight: '1px'
    },
    list: {
      padding: 0,
      paddingBottom: 2,
      paddingTop: 2,
      height: 'calc(100vh - 54px)',
      display: 'flex',
      flexDirection: 'column'
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
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
    },
}

export default sx