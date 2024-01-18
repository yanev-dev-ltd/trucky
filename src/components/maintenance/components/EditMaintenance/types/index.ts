import { UploadedFile } from '@/components/common/Upload/types'
import { Maintenance } from '@/components/maintenance/types'
import { Dispatch, SetStateAction } from 'react'

export type EditMaintenanceProps = {
    maintenance?: Maintenance
    edit: string | undefined
    reset: () => void
    saveMaintenanceField: (field: keyof Maintenance) => void
    setEditedMaintenance: Dispatch<SetStateAction<Maintenance>>
    editedMaintenance: Maintenance | undefined
    deleteMaintenance: () => void
    onClose: () => void
    onCancel: () => void
    onEdit: (field: string) => void
    downloadFile: (f: UploadedFile) => void
    deleteFile: (f: UploadedFile, dbpath: string, dbkey: string, files: UploadedFile[]) => void
    files: UploadedFile[]
}

export type useEditMaintenanceProps = {
    maintenance?: Maintenance
    edit: string | undefined
    onClose: () => void
    onCancel: () => void
    onEdit: (field: string) => void
}