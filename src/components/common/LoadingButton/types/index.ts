import { ButtonProps } from '@mui/material'

export type LoadingButtonProps = {
    disabled?: boolean
    isLoading?: boolean
    children?: JSX.Element | string
} & ButtonProps