import { Client } from '@/components/clients/types'
import { Driver } from '@/components/drivers/types'
import { Trailer } from '@/components/trailers/types'
import { Vehicle } from '@/components/vehicles/types'
import { RootState } from '@/store/store'
import { SxProps, Theme } from '@mui/material'

export type SelectItem = Client & Driver & Trailer & Vehicle

export type AddItemProps = {
    open: boolean | string
    setOpen: (open: boolean | string) => void
    onSave: (itemId: any) => void
}

export type useSelectProps = {
    items: string[]
    setItems: (items: string[]) => void
    sx?: SxProps<Theme>
    multiple?: boolean
    type: keyof Pick<RootState, 'vehicles' | 'drivers' | 'trailers' | 'clients'>
}

export type SelectProps = {
    items: SelectItem[] | SelectItem | undefined
    setItems: (items: string[]) => void
    allItems: SelectItem[]
    sx?: SxProps<Theme>
    multiple?: boolean
    type: keyof Pick<RootState, 'vehicles' | 'drivers' | 'trailers' | 'clients'>
    AddItem: React.FC<AddItemProps>
}