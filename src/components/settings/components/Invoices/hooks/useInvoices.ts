import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { firestore, auth } from '@/services/firebase'
import { setReceipts } from '../redux'
import { Receipt } from '../types'
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc, orderBy } from 'firebase/firestore'
import { RootState } from '@/store/store'

const useInvoices = () => {
    const [loading, setLoading] = useState(false)
    const receipts = useSelector((state: RootState) => state.receipts)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const unsubscribeCustomers = onSnapshot(doc(firestore, 'customers', auth.currentUser?.uid), (doc) => {
            const data = doc.data()
            if (!data?.try_payment) setLoading(false)
        })
        const q = query(collection(firestore, 'receipts'), where('userId', '==', auth.currentUser?.uid), orderBy('date', 'desc'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const receipts: Receipt[] = []
            querySnapshot.forEach((doc) => {
                receipts.push({key: doc.id, ...doc.data()})
            })
            dispatch(setReceipts(receipts))
        })
        return () => {
            unsubscribe()
            unsubscribeCustomers()
        }
    }, [auth.currentUser?.uid])

    const makePayment = async (invoiceId: string | undefined) => {
        if (!invoiceId || !auth?.currentUser?.uid) return
        setLoading(true)
        try {
            await updateDoc(doc(firestore, 'customers', auth.currentUser.uid), {
                try_payment: invoiceId
            })
        } catch (error) {
            await addDoc(collection(firestore, 'errors'), { error, userId: auth.currentUser.uid })
            setLoading(false)
        }
    }

    return { receipts, makePayment, loading }
}

export default useInvoices