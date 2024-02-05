import { MouseEvent } from 'react'

export type useNavigationProps = {
    anchorEl: HTMLButtonElement | null
    handleClose: () => void
    handleClick: (event: MouseEvent<HTMLButtonElement>) => void
    notifications: Notification[]
    hasNotifications: boolean
    handleItemClick: (key: string, url: string) => void
}

export type Message = {
    subject: string
    html: string
    text: string
    description: string
}

export type Notification = {
    key: string
    message: Message
    date: number
    url: string
    status: string
}