import { Service } from '../../../../../types'
export type NewServiceProps = {
    addService: (s: Service) => void
    driver: string
    units?: string
}