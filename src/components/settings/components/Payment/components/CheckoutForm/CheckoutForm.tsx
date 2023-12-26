import { useMemo } from 'react'
import {
    Box,
    TextField,
    Typography,
    Button,
    FormControlLabel,
    Checkbox,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Add } from '@mui/icons-material'
import { FormattedMessage, useIntl } from 'react-intl'
import sx from './styles/CheckoutForm.sx'
import { CardElement } from '@stripe/react-stripe-js'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { CheckoutFormProps } from './types/index'
import useCheckoutForm from './hooks/useCheckoutForm'

const CheckoutForm = ({ handleFormClose }: CheckoutFormProps) => {
    const intl = useIntl()
    const theme = useTheme()
    const { handleChange, handleSubmit, loading, stripe } = useCheckoutForm({
        handleFormClose,
    })

    const options = {
        style: {
            base: {
                color: theme.palette.text.primary,
                fontWeight: 500,
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                ':-webkit-autofill': { color: '#fce883' },
                '::placeholder': { color: '#999' },
            },
            invalid: {
                iconColor: '#ffc7ee',
                color: '#ffc7ee',
            },
        },
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box sx={sx.fields}>
                <TextField
                    id="user-name"
                    sx={sx.field}
                    label={intl.formatMessage({ id: 'app.Name' })}
                    variant="outlined"
                    onChange={handleChange('name')}
                />
                <TextField
                    id="user-phone"
                    sx={sx.field}
                    label={intl.formatMessage({ id: 'app.Phone' })}
                    variant="outlined"
                    onChange={handleChange('phone')}
                />
                <TextField
                    id="user-email"
                    sx={sx.field}
                    label={intl.formatMessage({ id: 'app.Email' })}
                    variant="outlined"
                    onChange={handleChange('email')}
                />
            </Box>
            <Box sx={sx.wrapper}>
                <CardElement options={options} />
            </Box>
            <Box display="flex" justifyContent="space-between">
                <FormControlLabel
                    control={
                        <Checkbox
                            defaultChecked
                            onChange={handleChange('auto_payment')}
                        />
                    }
                    label={intl.formatMessage({ id: 'app.AutomaticPayment' })}
                />
                <Box gap={1} display="flex">
                    <Button onClick={handleFormClose}>
                        <FormattedMessage id="app.Cancel" />
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        isLoading={loading}
                        disabled={!stripe}
                        startIcon={<Add />}
                    >
                        <FormattedMessage id="app.AddCard" />
                    </LoadingButton>
                </Box>
            </Box>
        </Box>
    )
}

export default CheckoutForm
