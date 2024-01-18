import { Vehicle } from '@/components/vehicles/types'
import { useTrailersSelectProps } from '../types'
import { RootState } from '@/store/store'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { firestore, auth } from '@/services/firebase'
import { setTrailers as setTrailersRedux } from '@/components/trailers/redux'
import { Trailer } from '@/components/trailers/types'

const useTrailersSelect = ({ trailers, setTrailers, sx, multiple, type }: useTrailersSelectProps) => {
    const allTrailers = useSelector((state: RootState) => state.trailers)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const conditions = [where('userId', '==', auth.currentUser?.uid)]
        const q = query(collection(firestore, 'trailers'), ...conditions)
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const trailers: Trailer[] = []
            querySnapshot.forEach((doc) => {
                trailers.push({...doc.data() as Trailer, key: doc.id})
            })
            dispatch(setTrailersRedux(trailers))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid])

    const selectedValue = useMemo(() => {
        if (trailers && multiple) {
            return allTrailers.filter((t: Trailer) => trailers.includes(t.key)) || []
        }
        return trailers && allTrailers.find((t: Trailer) => t.key === trailers[0])
    }, [trailers, allTrailers, multiple])

    return { trailers: selectedValue, setTrailers, allTrailers, sx, multiple, type }
}

export default useTrailersSelect