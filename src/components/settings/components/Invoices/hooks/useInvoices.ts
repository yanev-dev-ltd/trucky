import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'
import { db, auth } from '@/services/firebase'
import { setReceipts } from '../redux'
import { Receipt } from '../types'
import { snapshotToArray } from '@/utils/globalUtils'
import { RootState } from '@/store/store'

const useInvoices = () => {
    const receipts = useSelector((state: RootState) => state.receipts)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const unsubscribe = onValue(ref(db, 'receipts/' + auth.currentUser?.uid), (snapshot) => {
            const snp = snapshot.val()
            dispatch(setReceipts(snp ? snapshotToArray(snp).sort(
                (a: Receipt, b: Receipt) => {
                if (a?.date && b?.date) return b.date - a.date
                return 0
            }) : []))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid])

    const makePayment = async (invoiceId: string | undefined) => {
        if (!invoiceId) return
    }

    return { receipts, makePayment }
}

export default useInvoices