import { Driver } from '@/components/drivers/types'
import { UploadedFile } from '@/components/common/Upload/types'
export type useEditDriverProps = {
    driver: Driver
    edit: string | undefined
}
export type EditDriverProps = {
    driver: Driver
    edit: string | undefined
    reset: () => void
    saveDriverField: (field: keyof Driver) => void
    setEditedDriver: (driver: Driver | undefined) => void
    editedDriver: Driver | undefined
    downloadFile: (f: UploadedFile) => void
    deleteUploadedFile: (f: UploadedFile) => void
    deleteDriver: () => void
}