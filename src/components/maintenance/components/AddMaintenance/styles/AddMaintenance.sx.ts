import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    form: {
        width: 420
    },
    row: {
      paddingTop: 1,
      paddingBottom: 1
    },
    rowUpload: {
      padding: 1,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      borderRadius: 1,
      position: 'relative',
    },
    edit: {
      position: 'absolute',
      top: 1,
      right: 1,
    }
}

export default sx