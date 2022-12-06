import { useState, MouseEvent } from 'react'
import { useHeaderProps } from '../types';
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../../store/store'

const useHeader = (): useHeaderProps => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [fullscreen, setFullscreen] = useState(false)
    const settings = useSelector((state: RootState) => state.settings)

    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      }

    const handleFullscreen = () => {
        const body = document.querySelector('body');
        const fullscreenChange = () => {
        if (!document.fullscreenElement) {
            setFullscreen(false);
        }
        };
        if (!document.fullscreenElement) {
        body?.requestFullscreen();
        document.addEventListener('fullscreenchange', fullscreenChange);
        document.addEventListener('webkitfullscreenchange', fullscreenChange);
        document.addEventListener('mozfullscreenchange', fullscreenChange);
        document.addEventListener('MSFullscreenChange', fullscreenChange);
        setFullscreen(true);
        } else {
        document.exitFullscreen();
        setFullscreen(false);
        }
    }

    return { anchorEl, handleFullscreen, fullscreen, handleClose, handleClick, settings }
}

export default useHeader