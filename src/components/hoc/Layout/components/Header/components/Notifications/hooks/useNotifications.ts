import { useState, MouseEvent, useEffect, useCallback, useMemo } from 'react'
import { collection, query, where, onSnapshot, writeBatch, doc, orderBy } from 'firebase/firestore'
import { firestore, auth } from '@/services/firebase'
import { setNotifications } from '../redux'
import { useNavigationProps, Notification } from '../types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter } from 'next/router'
import { ro } from 'date-fns/locale'

const useNotifications = (): useNavigationProps => {
    const dispatch = useDispatch()
    const notifications = useSelector((state: RootState) => state.notifications)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [hasNotifications, setHasNotifications] = useState(false)
    const router = useRouter()

    const unreadNotifications = useMemo(() => notifications.filter(n => n.status === 'unread').length, [notifications])

    useEffect(() => {
        const qd = query(
            collection(firestore, 'notifications'),
            where('userId', '==', auth.currentUser?.uid),
            where('status', 'in', ['unread', 'read']),
            orderBy('date', 'desc'))
        const unsubscribe = onSnapshot(qd, (querySnapshot) => {
            const n: Notification[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                    n.push({key: doc.id, date: data.date, message: data.message, status: data.status, url: data.url } as Notification)
            })
            if (unreadNotifications < n.filter(n => n.status === 'unread').length) {
                const audio = new Audio('/sounds/notification.wav')
                audio.play()
            }
            dispatch(setNotifications(n))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid, unreadNotifications])

    useEffect(() => {
        if (notifications.find(n => n.status === 'unread')) {
            setHasNotifications(true)
        } else {
            setHasNotifications(false)
        }
    }, [notifications])

    const handleClose = useCallback(async () => {
        setAnchorEl(null)
        const batch = writeBatch(firestore)
        const unreadNotifications = notifications.filter(n => n.status === 'unread')
        unreadNotifications.forEach(n => {
            batch.update(doc(firestore, 'notifications', n.key), {status: 'read'})
        })
        await batch.commit()
    }, [notifications])

    const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    },[])

    const handleItemClick = useCallback((key: string, url: string) => {
        const batch = writeBatch(firestore)
        batch.delete(doc(firestore, 'notifications', key))
        batch.commit()
        router.push(url)
        setAnchorEl(null)
    }, [])
    return { anchorEl, handleClick, handleClose, notifications, hasNotifications, handleItemClick}
}

export default useNotifications