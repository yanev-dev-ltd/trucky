import { Add } from '@mui/icons-material'
import { Button, Tooltip } from '@mui/material'
import { useEffect, useState, useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { OrderDialog } from '../OrderDialog/OrderDialog'
import { Order } from '../../types'
import { setDoc, doc } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { useSnackbar } from 'notistack'

const AddOrderWithButton = () => {
    const [open, setOpen] = useState(false)
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
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
    const addOrder = useCallback(async (order: Order) => {
        const { key, ...rest } = order
        try {
            await setDoc(doc(firestore, 'orders', key || ''), rest)
            enqueueSnackbar(
                intl.formatMessage({
                    id: 'app.Saved.order',
                }),
                { variant: 'success' }
            )
        } catch (error) {
            enqueueSnackbar(
                intl.formatMessage({
                    id: 'app.Error.saving',
                }),
                { variant: 'error', persist: true }
            )
        }
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
                    <FormattedMessage id="app.AddOrder" />
                </Button>
            </Tooltip>
            <OrderDialog
                setOpen={() => setOpen(false)}
                open={open}
                isNew
                addOrder={addOrder}
            />
        </>
    )
}

export default AddOrderWithButton
