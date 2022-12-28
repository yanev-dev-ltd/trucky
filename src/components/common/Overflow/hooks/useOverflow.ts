import { useState, useEffect, useRef, useCallback } from 'react'

const useOverflow = () => {
    const [isOverflow, setIsOverflow] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const isEllipsisActive = () => {
            requestAnimationFrame(() => {
                ref.current && setIsOverflow(ref.current.getBoundingClientRect().width < ref.current.scrollWidth)
            })
        }
        isEllipsisActive()
        document.addEventListener('resize', isEllipsisActive)
        return () => document.removeEventListener("resize", isEllipsisActive)
    }, [ref])

    return { isOverflow, ref }
}

export default useOverflow