import { useState, useEffect, useMemo } from 'react'
import { debounce } from '@mui/material/utils'
import { PlaceType } from '../types'
import { Location } from '../../../types'
import { v4 as uuid } from 'uuid'

const autocompleteService = { current: null }
const useStopDialog = (parentLocation: Location | undefined, setOpen?: ((open: boolean) => void) | undefined) => {
    const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false)
    const [loadingLocation, setLoadingLocation] = useState<boolean>(false)
    const [value, setValue] = useState<PlaceType | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [options, setOptions] = useState<readonly PlaceType[]>([])
    const [location, setLocation] = useState<Location | undefined>(parentLocation)
    const fetch = useMemo(
        () =>
            debounce(
                (
                    request: { input: string },
                    callback: (results?: readonly PlaceType[]) => void
                ) => {
                    ;(autocompleteService.current as any).getPlacePredictions(
                        request,
                        callback
                    )
                },
                400
            ),
        []
    )

    useEffect(() => {
        if (!autocompleteService.current && (window as any).google) {
            autocompleteService.current = new (
                window as any
            ).google.maps.places.AutocompleteService()
        }
        if (!autocompleteService.current) {
            return undefined
        }

        if (inputValue === '') {
            setOptions(value ? [value] : [])
            return undefined
        }
        setLoadingSuggestions(true)

        fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
            let newOptions: readonly PlaceType[] = []
            setLoadingSuggestions(false)
            if (value) {
                setLoadingLocation(true)
                newOptions = [value]
                var geocoder = new (window as any).google.maps.Geocoder()
                geocoder.geocode(
                    { address: value.description },
                    (result: any, status: any) => {
                        setLoadingLocation(false)
                        if (
                            status ==
                            (window as any).google.maps.GeocoderStatus.OK
                        ) {
                            setLocation((oldLocation) => {
                                const code = []
                                const postalCode = result[0]?.address_components[result[0].address_components.length - 1]?.short_name
                                code.push(postalCode)
                                if (!isNaN(+postalCode)) code.push(result[0]?.address_components[result[0].address_components.length - 2]?.short_name)
                                else code.unshift(result[0]?.address_components[0]?.short_name)
                                return {
                                    ...oldLocation,
                                    code: code.reverse().join(' '),
                                    address: value.description,
                                    lat: result[0].geometry.location.lat(),
                                    lng: result[0].geometry.location.lng(),
                                    id: uuid()
                                }
                            })
                        }
                    }
                )
            }

            if (results) {
                newOptions = [...newOptions, ...results]
            }

            setOptions(newOptions)
        })
    }, [value, inputValue, fetch])

    const changeField = (field: keyof Location, value: any) => {
        setLocation((oldLocation) => oldLocation ? { ...oldLocation, [field]: value } : { [field]: value })
    }

    const handleClose = () => {
        setLocation(undefined)
        setValue(null)
        setOptions([])
        setInputValue('')
        setLoadingSuggestions(false)
        setLoadingLocation(false)
        setOpen && setOpen(false)
    }

    return {
        loadingSuggestions,
        loadingLocation,
        value,
        setValue,
        setInputValue,
        options,
        setOptions,
        location,
        changeField,
        setLocation,
        handleClose
    }
}

export default useStopDialog