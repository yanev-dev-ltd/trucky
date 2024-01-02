import { Autocomplete, TextField, Box } from '@mui/material'
import useCurrency from './hooks/useCurrency'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { FormattedMessage } from 'react-intl'
import currencies from '@/api/currencies.json'

export type Currency = {
    symbol: string
    name: string
    symbol_native: string
    decimal_digits: number
    rounding: number
    code: string
    name_plural: string
}

export type Currencies = {
    [key: string]: Currency
}

const Theme = () => {
    const { settings } = useSelector((state: RootState) => state.settings)
    const { handleChange } = useCurrency()
    return (
        <Autocomplete
            options={Object.keys(currencies)}
            fullWidth
            value={settings.currency || 'EUR'}
            onChange={(event: any, newValue: string | null) => {
                handleChange(newValue || 'EUR')
            }}
            getOptionLabel={(option) =>
                option
                    ? `[${(currencies as Currencies)[option].code}] ${
                          (currencies as Currencies)[option].symbol
                      }`
                    : ''
            }
            renderOption={(props, option) => (
                <Box component="li" {...props}>
                    {`[${(currencies as Currencies)[option].code}] ${
                        (currencies as Currencies)[option].symbol
                    }`}
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    label={<FormattedMessage id="app.Currency" />}
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                />
            )}
        />
    )
}

export default Theme
