import { Trailer } from '../../../types'
import { Maintenances } from '@/components/maintenance/types'
import { UploadedFile } from '@/components/common/Upload/types'
export type EditTrailerProps = {
    trailer: Trailer | undefined
    edit: string | undefined
}

export type useEditTrailerResponse = {
    saveTrailerField: (field: keyof Trailer) => void
    editedTrailer: Trailer | undefined
    setEditedTrailer: (trailer: Trailer | undefined) => void
    reset: () => void
    downloadFile: (f: UploadedFile) => void
    deleteFile: (f: UploadedFile, dbpath: string, dbkey: string, files: UploadedFile[]) => void
    deleteTrailer: () => void
    maintenances: Maintenances
    files: UploadedFile[]
}