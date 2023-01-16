import { Service } from '../../../../../types'

export type EditServiceProps = {
    handleEditServiceClose: () => void
    service: Service | undefined
    units?: string
}