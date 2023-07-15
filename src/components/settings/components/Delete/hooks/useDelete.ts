import { useState, useEffect } from 'react'

const useDelete = () => {
    const [modalOpen, setModalOpen] = useState(false)

    const handleModalClose = () => {
        setModalOpen(false)
    }

    const handleModalOpen = () => {
        setModalOpen(true)
    }

    const handleDeleteAccount = () => {
    // TODO: delete account, db and storage (maybe use function)
    }

    return { handleDeleteAccount, handleModalOpen, handleModalClose, modalOpen }
}

export default useDelete