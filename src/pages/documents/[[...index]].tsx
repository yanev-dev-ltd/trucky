import { Documents as DocumentsComponent } from '@/components/documents/Documents'
import { useRouter } from 'next/router'

export default function Documents(): JSX.Element {
    const router = useRouter()
    const documentId =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[0]
            : undefined
    const edit =
        router.isReady && router.query.index && router.query.index.length > 1
            ? router.query.index[1]
            : undefined
    return <DocumentsComponent documentId={documentId} edit={edit} />
}
