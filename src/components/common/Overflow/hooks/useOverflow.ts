import { useState, useLayoutEffect, useRef } from 'react'

const useOverflow = () => {
    const [isOverflow, setIsOverflow] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement | null>(null)
    useLayoutEffect(() => {
        const isEllipsisActive = () => {
            ref.current && setIsOverflow(ref.current.clientWidth < ref.current.scrollWidth)
        }
        isEllipsisActive()
        document.addEventListener('resize', isEllipsisActive)
        return () => document.removeEventListener("resize", isEllipsisActive)
    }, [ref])

    return { isOverflow, ref }
}

export default useOverflow