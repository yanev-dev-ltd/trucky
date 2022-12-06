import { MouseEvent } from 'react'
import { Settings } from '../../../../../../providers/AppUiProviders/types'

export type HeaderProps = {
    anchorEl: HTMLButtonElement | null
    handleFullscreen: () => void
    fullscreen: boolean
    handleClose: () => void
    handleClick: (event: MouseEvent<HTMLButtonElement>) => void
    settings?: Settings
}

export type useHeaderProps = {
    anchorEl: HTMLButtonElement | null
    handleFullscreen: () => void
    fullscreen: boolean
    handleClose: () => void
    handleClick: (event: MouseEvent<HTMLButtonElement>) => void
    settings?: Settings
}