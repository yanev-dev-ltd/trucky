import { UploadedFile } from '@/components/common/Upload/types'
import { Maintenance } from '@/components/maintenance/types'

export type AddMaintenanceProps = {
    units: string
    vehicleId?: string
    setField: (field: string, value: string | number | null | string[]) => void
    maintenance: Maintenance
    fullButton?: boolean
    handleOpen: () => void
    handleClose: () => void
    handleSubmit: () => void
    newMaintenanceOpen: string | false
    files: UploadedFile[]
    downloadFile: (f: UploadedFile) => void
    deleteFile: (f: UploadedFile, dbpath: string, dbkey: string, files: UploadedFile[]) => void
    isTrailer?: boolean
}

export type useAddMaintenanceProps = {
    drivers?: string[]
    vehicleId?: string
    units: string
    fullButton?: boolean
    isTrailer?: boolean
}