import { ChangeEvent } from 'react'
import {
    Dialog,
    Box,
    DialogContent,
    Typography,
    TextField,
    Autocomplete,
    DialogActions,
    DialogTitle,
    Button,
    Grid,
    CircularProgress,
    IconButton,
    Checkbox,
    FormControlLabel,
} from '@mui/material'
import {
    LocationOn,
    Close,
    FileUpload,
    LocalParking,
    LocalGasStation,
    Download,
} from '@mui/icons-material'
import { StopDialogProps, PlaceType } from './types'
import parse from 'autosuggest-highlight/parse'
import sx from './sx/StopDialog.sx'
import { FormattedMessage } from 'react-intl'
import useRouteDialog from './hooks/useStopDialog'

const StopDialog = ({
    parentLocation,
    open,
    setOpen,
    addLocation,
}: StopDialogProps) => {
    const {
        loadingSuggestions,
        loadingLocation,
        value,
        setValue,
        setInputValue,
        options,
        setOptions,
        location,
        changeField,
        handleClose,
    } = useRouteDialog(parentLocation, setOpen)

    return (
        <Dialog open={open || false}>
            <DialogTitle sx={sx.header}>
                <FormattedMessage id="app.AddStop" />
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={sx.row}>
                    <Autocomplete
                        fullWidth
                        getOptionLabel={(option) =>
                            typeof option === 'string'
                                ? option
                                : option.description || ''
                        }
                        filterOptions={(x) => x}
                        options={options}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        defaultValue={{ description: location?.address }}
                        value={value}
                        noOptionsText={<FormattedMessage id="app.NoStops" />}
                        onChange={(event: any, newValue: PlaceType | null) => {
                            setOptions(
                                newValue ? [newValue, ...options] : options
                            )
                            setValue(newValue)
                        }}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue)
                        }}
                        disabled={loadingLocation}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={<FormattedMessage id="app.Stop" />}
                                fullWidth
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment:
                                        loadingLocation ||
                                        loadingSuggestions ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            <LocationOn
                                                sx={{
                                                    color: 'text.secondary',
                                                }}
                                            />
                                        ),
                                }}
                            />
                        )}
                        renderOption={(props, option, state) => {
                            const matches =
                                option?.structured_formatting
                                    ?.main_text_matched_substrings || []
                            const parts = parse(
                                option?.structured_formatting?.main_text || '',
                                matches.map((match: any) => [
                                    match.offset,
                                    match.offset + match.length,
                                ])
                            )

                            return (
                                <li {...props} key={state.index}>
                                    <Grid container alignItems="center">
                                        <Grid
                                            item
                                            sx={{
                                                display: 'flex',
                                                width: 44,
                                            }}
                                        >
                                            <LocationOn
                                                sx={{
                                                    color: 'text.secondary',
                                                }}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            sx={{
                                                width: 'calc(100% - 44px)',
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            {parts.map((part, index) => (
                                                <Box
                                                    key={index}
                                                    component="span"
                                                    sx={{
                                                        fontWeight:
                                                            part.highlight
                                                                ? 'bold'
                                                                : 'regular',
                                                    }}
                                                >
                                                    {part.text}
                                                </Box>
                                            ))}
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {
                                                    option
                                                        ?.structured_formatting
                                                        ?.secondary_text
                                                }
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </li>
                            )
                        }}
                    />
                </Box>
                <Box sx={sx.row}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={location?.loading || false}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) =>
                                    changeField('loading', event.target.checked)
                                }
                            />
                        }
                        label={
                            <Box sx={sx.checkbox}>
                                <FileUpload />
                                <FormattedMessage id="app.Loading" />
                            </Box>
                        }
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={location?.unloading || false}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) =>
                                    changeField(
                                        'unloading',
                                        event.target.checked
                                    )
                                }
                            />
                        }
                        label={
                            <Box sx={sx.checkbox}>
                                <Download />
                                <FormattedMessage id="app.Unloading" />
                            </Box>
                        }
                    />
                </Box>
                <Box sx={sx.row}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={location?.parking || false}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) =>
                                    changeField('parking', event.target.checked)
                                }
                            />
                        }
                        label={
                            <Box sx={sx.checkbox}>
                                <LocalParking />
                                <FormattedMessage id="app.Parking" />
                            </Box>
                        }
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={location?.refueling || false}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) =>
                                    changeField(
                                        'refueling',
                                        event.target.checked
                                    )
                                }
                            />
                        }
                        label={
                            <Box sx={sx.checkbox}>
                                <LocalGasStation />
                                <FormattedMessage id="app.Refueling" />
                            </Box>
                        }
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    <FormattedMessage id="app.Cancel" />
                </Button>
                <Button
                    variant="contained"
                    disabled={!value || loadingLocation || loadingSuggestions}
                    onClick={() => {
                        addLocation(location)
                        handleClose()
                    }}
                >
                    <FormattedMessage id="app.Save" />
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default StopDialog
