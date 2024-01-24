import {
    FormControl,
    TextField,
    Autocomplete,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { SelectRouteProps, SelectRouteItem } from '../types'

const SelectRouteView = ({ allItems, item, setFields }: SelectRouteProps) => {
    return (
        <>
            <FormControl fullWidth variant="outlined">
                <Autocomplete
                    id={'route-select'}
                    options={allItems as SelectRouteItem[]}
                    value={item || { name: '', vehicle: '' }}
                    getOptionLabel={(option) => option?.name || ''}
                    onChange={(_, values) => {
                        setFields({
                            routeId: values?.key || '',
                            vehicleId: values?.vehicleId || '',
                        })
                    }}
                    renderOption={(props, option) => (
                        <ListItem {...props} key={option?.key}>
                            <ListItemText
                                primary={option?.name}
                                secondary={
                                    <>
                                        <Typography
                                            sx={{ display: 'block' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {option.date}
                                        </Typography>
                                        {option.vehicle}
                                    </>
                                }
                            />
                        </ListItem>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={<FormattedMessage id={'app.Route'} />}
                        />
                    )}
                />
            </FormControl>
        </>
    )
}

export default SelectRouteView
