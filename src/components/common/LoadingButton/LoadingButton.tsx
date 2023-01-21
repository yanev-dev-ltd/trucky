import { Button, CircularProgress } from '@mui/material'
import { LoadingButtonProps } from './types'

export default function LoadingButton({
    isLoading,
    disabled,
    children,
    ...props
}: LoadingButtonProps) {
    return (
        <Button disabled={isLoading ? true : disabled} {...props}>
            {isLoading ? <CircularProgress size={24} /> : children}
        </Button>
    )
}
