import { Box, Typography, Tooltip } from '@mui/material'
import useOverflow from './hooks/useOverflow'
import sx from './styles/Overflow.sx'
import { OverflowProps } from './types'

const Overflow = ({ text, variant = 'body2' }: OverflowProps) => {
    const { isOverflow, ref } = useOverflow()
    return (
        <Box ref={ref} sx={sx.root}>
            {isOverflow ? (
                <Tooltip title={text}>
                    <Typography sx={sx.text} variant={variant}>
                        {text &&
                            text
                                .toString()
                                .replaceAll(' ', String.fromCharCode(160))}
                    </Typography>
                </Tooltip>
            ) : (
                <Typography variant={variant}>
                    {text &&
                        text
                            .toString()
                            .replaceAll(' ', String.fromCharCode(160))}
                </Typography>
            )}
        </Box>
    )
}

export default Overflow
