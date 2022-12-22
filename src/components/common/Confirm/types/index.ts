import { ReactNode } from 'react'
export type ConfirmProps = {
    isOpen: boolean
    onCancel: () => void
    onSubmit: () => void
    message?: string | ReactNode
}