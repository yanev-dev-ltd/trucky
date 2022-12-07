import { MouseEvent } from 'react'

export type useNavigationProps = {
    anchorEl: HTMLButtonElement | null
    handleClose: () => void
    handleClick: (event: MouseEvent<HTMLButtonElement>) => void
}