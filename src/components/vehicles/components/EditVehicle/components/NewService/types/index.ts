import { Service } from '../../../../../types'
import { Driver } from '@/components/drivers/types'
export type NewServiceProps = {
    addService: (s: Service) => void
    drivers: string[]
    units?: string
}