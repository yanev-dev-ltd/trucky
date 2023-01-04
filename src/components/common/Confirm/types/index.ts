import { ReactNode } from 'react'
export type ConfirmProps = {
    isOpen: boolean
    onCancel: () => void
    onSubmit: () => void
    message?: string | ReactNode
    type?: string
    submit?: string | ReactNode
    cancel?: string | ReactNode
}