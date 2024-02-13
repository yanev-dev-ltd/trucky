import { Driver } from '@/components/drivers/types'
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
    deleteDriver: () => void
}