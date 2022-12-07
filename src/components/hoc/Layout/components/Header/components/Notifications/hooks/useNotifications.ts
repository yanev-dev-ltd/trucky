import { useState, MouseEvent } from 'react'
import { useNavigationProps } from '../types'

const useNotifications = (): useNavigationProps => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    return { anchorEl, handleClick, handleClose }
}

export default useNotifications