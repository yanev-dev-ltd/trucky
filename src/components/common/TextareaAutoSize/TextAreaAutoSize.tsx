import TextareaAutosize from '@mui/base/TextareaAutosize'
import { styled } from '@mui/system'
const TextareaAutoSize = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    padding: '14px',
    fontFamily: 'Roboto',
    borderRadius: '4px 4px 0 4px',
    resize: 'vertical',
    color:
        theme.palette.mode === 'dark'
            ? theme.palette.grey[300]
            : theme.palette.grey[900],
    background: 'transparent',
    border: `1px solid ${
        theme.palette.mode === 'dark'
            ? theme.palette.grey[700]
            : theme.palette.grey[200]
    }`,
    '&:focus': {
        outline: `1px solid ${theme.palette.primary.main}`,
    },
    '&::-webkit-scrollbar': {
        width: '5px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.background.paper,
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.text.secondary,
    },
}))

export default TextareaAutoSize
