import { useCallback, ChangeEvent } from 'react'
import { firestore, auth } from '@/services/firebase'
import { updateDoc, doc } from 'firebase/firestore'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'

const useSound = () => {
    const { enqueueSnackbar } = useSnackbar()
    const intl = useIntl()
    const handleChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        if (!auth?.currentUser?.uid) return
        try {
            await updateDoc(doc(firestore, 'settings', auth.currentUser.uid), { sound: (event.target as HTMLInputElement).value })
            enqueueSnackbar(intl.formatMessage({ id: 'app.Saved.sound'}), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({ id: 'app.Error.saving'}), { variant: 'error', persist: true })
        }
    }, [])

    return { handleChange }
}

export default useSound