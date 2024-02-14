import Fuse from 'fuse.js'
import { Document } from '@/components/common/Documents/types'

const useDocumentsFuse = (documents: Document[]) => {
    const fuse: Fuse<Document> = new Fuse(documents, {
        keys: [
            'title',
            'name',
            'type',
        ],
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        minMatchCharLength: 3,
    })

    return { fuse }
}

export default useDocumentsFuse