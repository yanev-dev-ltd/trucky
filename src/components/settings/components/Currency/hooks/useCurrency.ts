import { useCallback } from 'react'
import { firestore, auth } from '@/services/firebase'
import { updateDoc, doc } from 'firebase/firestore'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'

const useCurrency = () => {
    const { enqueueSnackbar } = useSnackbar()
    const intl = useIntl()
    const handleChange = useCallback(async (currency: string) => {
        if (!auth?.currentUser?.uid) return
        try {
            await updateDoc(doc(firestore, 'settings', auth.currentUser.uid), { currency })
            enqueueSnackbar(intl.formatMessage({ id: 'app.Saved.currency'}), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({ id: 'app.Error.saving'}), { variant: 'error', persist: true })
        }
    }, [])

    return { handleChange }
}

export default useCurrency