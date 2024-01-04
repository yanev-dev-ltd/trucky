import { useEffect, useState, MouseEvent, useCallback } from 'react'
import { useGroupProps, GroupType, Group } from '../types'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { firestore, auth } from '@/services/firebase'
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { setGroups } from '../redux'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'

const useGroup = ({ type }: useGroupProps) => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const groups = useSelector((state: RootState) => state.groups)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [editGroupIndex, setEditGroupIndex] = useState<number | null>(null)
    const [editedGroup, setEditedGroup] = useState<Group>()
    const [editLoading, setEditLoading] = useState(false)
    const dispatch = useDispatch()

    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const editGroup = useCallback(async () => {
        if (!editedGroup?.key || !editedGroup?.type || !editedGroup?.userId || !auth?.currentUser?.uid) return
        setEditLoading(true)
        try {
            await updateDoc(doc(firestore, 'groups', editedGroup.key), {
                name: editedGroup.name,
                description: editedGroup.description,
            })
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Saved.group',
            }), { variant: 'success' })
            setEditedGroup(undefined)
            setEditGroupIndex(null)
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.saving',
            }), { variant: 'error', persist: true })
        } finally {
            setEditLoading(false)
        }
    }, [editedGroup, auth.currentUser?.uid])

    const deleteGroup = useCallback(async () => {
        if (!editedGroup?.key || !auth?.currentUser?.uid) return
        try {
            await deleteDoc(doc(firestore, 'groups', editedGroup?.key))
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedGroupSuccess',
            }), { variant: 'success' })
            setEditedGroup(undefined)
            setEditGroupIndex(null)
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedGroupError',
            }), { variant: 'error', persist: true })
        }
    }, [editedGroup?.key, auth?.currentUser?.uid])

    useEffect(() => {
        if (editGroupIndex === null) {
            setEditedGroup(undefined)
            return
        }
        setEditedGroup(groups[editGroupIndex])
    }, [editGroupIndex])

    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const q = query(collection(firestore, 'groups'), where('userId', '==', auth.currentUser?.uid), where('type', '==', GroupType[type]))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const groupsList: Group[] = []
            querySnapshot.forEach((doc) => {
                groupsList.push({...doc.data() as Group, key: doc.id})
            })
            dispatch(setGroups(groupsList))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid])

    return {
        groups,
        anchorEl,
        handleClick,
        handleClose,
        editGroupIndex,
        setEditGroupIndex,
        editGroup,
        editedGroup,
        setEditedGroup,
        editLoading,
        deleteGroup,
        type,
    }
}

export default useGroup