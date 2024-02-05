import { useState, useEffect } from 'react'
import { Add } from '@mui/icons-material'
import { Button, Tooltip } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Route from '../Route/Route'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

const AddRouteWithButton = () => {
    const [open, setOpen] = useState(false)
    const { settings } = useSelector((state: RootState) => state.settings)
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
                    <FormattedMessage id="app.AddRoute" />
                </Button>
            </Tooltip>
            {open && (
                <Route onClose={() => setOpen(false)} units={settings.units} />
            )}
        </>
    )
}

export default AddRouteWithButton
