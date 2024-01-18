import { useState, useCallback, useEffect } from 'react'
import { auth, firestore } from '@/services/firebase'
import { useRouter } from 'next/router'
import { useAddTrailerProps, NewTrailer } from '../types'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { collection, addDoc } from 'firebase/firestore'

const useAddTrailer = ({onSave, setOpen, open, redirectToEdit}: useAddTrailerProps) => {
    const intl = useIntl()
    const { settings } = useSelector((state: RootState) => state.settings)
    const { enqueueSnackbar } = useSnackbar()
    const [newTrailerLoading, setNewTrailerLoading] = useState<boolean>(false)
    const [newTrailer, setNewTrailer] = useState<NewTrailer>({ units: settings.units })
    const router = useRouter()
    const handleAddTrailer = useCallback(() => {
        if (!auth.currentUser?.uid) return
        setOpen(true)
    },[auth.currentUser?.uid])

    const handleClose = useCallback(() => {
        setOpen(false)
        setNewTrailerLoading(false)
        setNewTrailer({ units: settings.units || 'km' })
    },[])

    const changeField = useCallback((field: keyof NewTrailer, value: string | string[]) => {
        setNewTrailer(oldTrailer => {
            return oldTrailer ? { ...oldTrailer, [field]: value  } : { units: settings.units, [field]: value }
        })
    }, [])

    const addTrailer = async () => {
        if (!auth.currentUser?.uid || !newTrailer?.name || !newTrailer?.type || !newTrailer?.units) return
        setNewTrailerLoading(true)
        try {
            const refDoc = await addDoc(collection(firestore, 'trailers'), { ...newTrailer, userId: auth.currentUser.uid })
            onSave && refDoc.id && onSave(refDoc.id)
            handleClose()
            redirectToEdit && router.push('/trailers/' + refDoc.id)
            enqueueSnackbar(intl.formatMessage({
                id: 'app.TrailerAdded',
            }), { variant: 'success' })
        } catch (error) {
            handleClose()
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.AddingTrailer',
            }), { variant: 'error', persist: true })
        } finally {
            setNewTrailerLoading(false)
        }
    }

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === 'n' && event.ctrlKey) {
                event.preventDefault()
                handleAddTrailer()
            }
        }
        document.addEventListener('keydown',handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress)
    }, [])

    return {
        open,
        handleClose,
        handleAddTrailer,
        changeField,
        addTrailer,
        newTrailer,
        newTrailerLoading,
    }
}

export default useAddTrailer