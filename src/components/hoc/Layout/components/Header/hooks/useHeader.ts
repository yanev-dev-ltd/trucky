import { useState } from 'react'
import { useHeaderProps } from '../types';

const useHeader = (): useHeaderProps => {
    const [fullscreen, setFullscreen] = useState(false)

    const handleFullscreen = () => {
        const body = document.querySelector('body')
        const fullscreenChange = () => {
            if (!document.fullscreenElement) {
                setFullscreen(false)
            }
        }
        if (!document.fullscreenElement) {
            body?.requestFullscreen();
            document.addEventListener('fullscreenchange', fullscreenChange)
            document.addEventListener('webkitfullscreenchange', fullscreenChange)
            document.addEventListener('mozfullscreenchange', fullscreenChange)
            document.addEventListener('MSFullscreenChange', fullscreenChange)
            setFullscreen(true);
        } else {
            document.exitFullscreen()
            setFullscreen(false)
        }
    }

    return { handleFullscreen, fullscreen }
}

export default useHeader