import { Service } from '../../../../../types'
export type NewServiceProps = {
    addService: (s: Service) => void
    drivers: string[]
    units?: string
}