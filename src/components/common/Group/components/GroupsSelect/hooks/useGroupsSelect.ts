import { useGroupsSelectProps } from '../types'
import { RootState } from '@/store/store'
import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { firestore, auth } from '@/services/firebase'
import { setGroups as setGroupsRedux } from '@/components/common/Group/redux'
import { Group } from '../../../types'

const useGroupsSelect = ({ groups, setGroups, sx, multiple, type }: useGroupsSelectProps) => {
    const allGroups = useSelector((state: RootState) => state.groups)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const q = query(collection(firestore, 'groups'), where('userId', '==', auth.currentUser?.uid), where('type', '==', type))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const groups: Group[] = []
            querySnapshot.forEach((doc) => {
                groups.push({...doc.data() as Group, key: doc.id})
            })
            dispatch(setGroupsRedux(groups))
        })
        return () => unsubscribe()
    }, [auth.currentUser?.uid])

    const selectedValue = useMemo(() => {
        if (groups && multiple) {
            return allGroups.filter((d) => groups.includes(d.key || '')) || []
        }
        if (groups && !multiple) return allGroups.find((d) => d.key === groups[0])
    }, [groups, allGroups, multiple])
    return { groups: selectedValue, setGroups, allGroups, sx, multiple, type }
}

export default useGroupsSelect