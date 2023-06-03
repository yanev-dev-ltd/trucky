import TextareaAutosize from '@mui/base/TextareaAutosize'
import { styled } from '@mui/system'
const TextareaAutoSize = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    padding: '14px',
    fontFamily: 'Roboto',
    borderRadius: '12px 12px 0 12px',
    resize: 'vertical',
    color:
        theme.palette.mode === 'dark'
            ? theme.palette.grey[300]
            : theme.palette.grey[900],
    background:
        theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#fff',
    border: `1px solid ${
        theme.palette.mode === 'dark'
            ? theme.palette.grey[700]
            : theme.palette.grey[200]
    }`,
}))

export default TextareaAutoSize
