import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { firestore, auth } from '@/services/firebase'
import { setTrailers } from '../redux'
import { TrailersProps, useTrailersProps, Trailer } from '../types'
import useTrailersColumns from './useTrailers.columns'
import useTrailersFuse from './useTrailers.fuse'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/router'

const useTrailers =  ({ trailerId, edit }:useTrailersProps): TrailersProps => {
    const dispatch = useDispatch()
    const trailers = useSelector((state: RootState) => state.trailers)
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useTrailersColumns(trailers)
    const { fuse } = useTrailersFuse(trailers)
    const router = useRouter()
    
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const conditions = [where('userId', '==', auth.currentUser?.uid)]
        router.query.group && conditions.push(where('groups', 'array-contains', router.query.group))
        const q = query(
            collection(firestore, 'trailers'),
            ...conditions
        )
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const trailers: Trailer[] = []
            querySnapshot.forEach((doc) => {
                trailers.push({...doc.data() as Trailer, key: doc.id})
            })
            dispatch(setTrailers(trailers))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid, router.query.group])

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === '/' && (event.target as HTMLElement)?.tagName.toUpperCase() !== 'INPUT' && (event.target as HTMLElement)?.tagName.toUpperCase() !== 'TEXTAREA') {
                event.preventDefault()
                searchRef.current?.focus()
            }
        }
        document.addEventListener('keydown', handleKeyPress)
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [])

    return { trailers, trailerId, edit, searchRef, fuse, columns }
}

export default useTrailers