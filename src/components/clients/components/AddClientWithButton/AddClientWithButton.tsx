import { useState, useEffect } from 'react'
import { Add } from '@mui/icons-material'
import { Button, Tooltip } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { AddClient } from '../AddClient/AddClient'

const AddClientWithButton = () => {
    const [open, setOpen] = useState(false)
    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === 'n' && event.ctrlKey) {
                event.preventDefault()
                setOpen(true)
            }
        }
        document.addEventListener('keydown', handleKeyPress)
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [])
    return (
        <>
            <Tooltip title="ctrl + N">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                    style={{ marginLeft: 'auto' }}
                >
                    <FormattedMessage id="app.AddClient" />
                </Button>
            </Tooltip>
            <AddClient
                open={open}
                setOpen={setOpen}
                onSave={() => setOpen(false)}
                redirectToEdit
            />
        </>
    )
}

export default AddClientWithButton
