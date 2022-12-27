import { useSnackbar } from 'notistack'
import { IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
const SnackbarClose = ({ id }: { id: number | string }) => {
    const { closeSnackbar } = useSnackbar()
    return (
        <IconButton onClick={() => closeSnackbar(id)} size="small">
            <Close />
        </IconButton>
    )
}

export default SnackbarClose
