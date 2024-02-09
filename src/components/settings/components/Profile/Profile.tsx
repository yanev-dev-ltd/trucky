import { Autocomplete, Box, TextField } from '@mui/material'
import useProfile from './hooks/useProfile'
import { FormattedMessage, useIntl } from 'react-intl'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'

import { Country } from '../../../../types/countries'

const Profile = () => {
    const { saveProfile, loading, profile, setProfile } = useProfile()
    const intl = useIntl()
    return (
        <Box component="form" onSubmit={saveProfile}>
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between' }}
                gap={2}
            >
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="firstName"
                    label={<FormattedMessage id="app.FirstName" />}
                    type="text"
                    id="firstName"
                    autoComplete="firstName"
                    value={profile.firstName || ''}
                    onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                    }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="lastName"
                    label={<FormattedMessage id="app.LastName" />}
                    type="text"
                    id="lastName"
                    autoComplete="lastName"
                    value={profile.lastName || ''}
                    onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                    }
                />
            </Box>
            <Box>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="company"
                    label={<FormattedMessage id="app.CompanyName" />}
                    type="text"
                    id="company"
                    autoComplete="company"
                    value={profile.company || ''}
                    onChange={(e) =>
                        setProfile({ ...profile, company: e.target.value })
                    }
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
                gap={2}
            >
                <Box sx={{ marginTop: 2, minWidth: '25%' }}>
                    <Autocomplete
                        options={Object.values(Country).sort((a, b) =>
                            intl
                                .formatMessage({
                                    id: `app.Country.${a}`,
                                })
                                .localeCompare(
                                    intl.formatMessage({
                                        id: `app.Country.${b}`,
                                    })
                                )
                        )}
                        fullWidth
                        value={profile?.address?.country || ''}
                        onChange={(event: any, newValue: string | null) => {
                            setProfile({
                                ...profile,
                                address: {
                                    ...profile.address,
                                    country: newValue || '',
                                },
                            })
                        }}
                        getOptionLabel={(option) =>
                            option
                                ? intl.formatMessage({
                                      id: `app.Country.${option}`,
                                  })
                                : ''
                        }
                        renderOption={(props, option) => (
                            <Box component="li" {...props}>
                                <FormattedMessage
                                    id={`app.Country.${option}`}
                                />
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label={<FormattedMessage id="app.Country" />}
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                            />
                        )}
                    />
                </Box>
                <TextField
                    variant="outlined"
                    margin="normal"
                    sx={{ width: '46%' }}
                    fullWidth
                    name="city"
                    label={<FormattedMessage id="app.City" />}
                    type="text"
                    id="city"
                    autoComplete="city"
                    value={profile?.address?.city || ''}
                    onChange={(e) =>
                        setProfile({
                            ...profile,
                            address: {
                                ...profile.address,
                                city: e.target.value,
                            },
                        })
                    }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="line1"
                    label={<FormattedMessage id="app.Address" />}
                    type="text"
                    id="line1"
                    autoComplete="address"
                    value={profile.address?.line1 || ''}
                    onChange={(e) =>
                        setProfile({
                            ...profile,
                            address: {
                                ...profile.address,
                                line1: e.target.value,
                            },
                        })
                    }
                />
            </Box>
            <Box>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="phone"
                    label={<FormattedMessage id="app.Phone" />}
                    type="text"
                    id="phone"
                    autoComplete="phone"
                    value={profile.phone || ''}
                    onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                    }
                />
            </Box>
            <Box sx={{ marginTop: 2 }}>
                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    isLoading={loading}
                >
                    <FormattedMessage id="app.Save" />
                </LoadingButton>
            </Box>
        </Box>
    )
}

export default Profile
