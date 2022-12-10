import { MouseEvent } from 'react'

export type useNavigationProps = {
    anchorEl: HTMLButtonElement | null
    handleClose: () => void
    handleClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export type NotificationItem = {
    id: number
    title: string
    message: string
    timeCreated: number
    url: string
}