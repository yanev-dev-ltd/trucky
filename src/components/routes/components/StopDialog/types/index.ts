import { Location } from '@/components/routes/components/Route/types'
export type StopDialogProps = {
    parentLocation?: Location
    open?: boolean
    setOpen?: (open: boolean) => void
    addLocation: (location: Location | undefined) => void | undefined
}

export type MainTextMatchedSubstrings = {
    offset: number
    length: number
}
export type StructuredFormatting = {
    main_text: string
    secondary_text: string
    main_text_matched_substrings?: readonly MainTextMatchedSubstrings[]
}
export type PlaceType = {
    description?: string
    structured_formatting?: StructuredFormatting
    place_id?: string
}