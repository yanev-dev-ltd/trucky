import {
    Box,
    Typography,
    TextField,
    Modal,
    Paper,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { FormattedMessage, useIntl } from 'react-intl'
import sx from '../styles/AddTrailer.sx'
import { TrailerTypes } from '../../../types'
import { AddTrailerProps } from '../types'

const AddTrailerView = ({
    open,
    handleClose,
    changeField,
    addTrailer,
    newTrailer,
    newTrailerLoading,
}: AddTrailerProps) => {
    const intl = useIntl()
    const typeKeys = Object.values(TrailerTypes) as Array<TrailerTypes>

    return (
        <Modal open={!!open}>
            <Box sx={sx.wrap}>
                <Paper sx={sx.modal}>
                    <Box
                        component="form"
                        onSubmit={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (
                                !newTrailer?.name ||
                                !newTrailer?.type ||
                                !newTrailer?.units
                            )
                                return
                            addTrailer()
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            sx={sx.paddingBottom}
                        >
                            <Typography variant="h6">
                                <FormattedMessage id="app.AddTrailer" />
                            </Typography>
                            <IconButton onClick={handleClose}>
                                <Close />
                            </IconButton>
                        </Box>
                        <Box sx={sx.row}>
                            <TextField
                                variant="outlined"
                                label={
                                    <FormattedMessage id="app.TrailerName" />
                                }
                                value={newTrailer?.name || ''}
                                onChange={(e) =>
                                    changeField('name', e.target.value)
                                }
                                fullWidth
                            />
                        </Box>
                        <Box sx={sx.row}>
                            <FormControl
                                fullWidth
                                variant="outlined"
                                sx={sx.select}
                            >
                                <InputLabel id="type-label">
                                    <FormattedMessage id="app.Type" />
                                </InputLabel>
                                <Select
                                    labelId="type-label"
                                    id="type"
                                    value={newTrailer?.type || ''}
                                    onChange={(event) => {
                                        changeField('type', event.target.value)
                                    }}
                                    label={<FormattedMessage id="app.Type" />}
                                >
                                    {!newTrailer?.type && (
                                        <MenuItem value={''} disabled>
                                            &#8212;
                                        </MenuItem>
                                    )}
                                    {typeKeys
                                        .sort((a, b) =>
                                            intl
                                                .formatMessage({
                                                    id: `app.TrailerType.${a}`,
                                                })
                                                .localeCompare(
                                                    intl.formatMessage({
                                                        id: `app.TrailerType.${b}`,
                                                    })
                                                )
                                        )
                                        .map((key, i) => (
                                            <MenuItem key={i} value={key}>
                                                {
                                                    <FormattedMessage
                                                        id={`app.TrailerType.${key}`}
                                                    />
                                                }
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={sx.row}>
                            <FormControl component="fieldset">
                                <FormLabel
                                    component="legend"
                                    sx={sx.paddingTop}
                                >
                                    <FormattedMessage id="app.Units" />
                                </FormLabel>
                                <RadioGroup
                                    aria-label="units"
                                    row
                                    name="units"
                                    value={newTrailer?.units}
                                    onChange={(event) =>
                                        changeField('units', event.target.value)
                                    }
                                >
                                    <FormControlLabel
                                        value="km"
                                        control={<Radio />}
                                        label={
                                            <FormattedMessage id="app.Kilometers" />
                                        }
                                    />
                                    <FormControlLabel
                                        value="m"
                                        control={<Radio />}
                                        label={
                                            <FormattedMessage id="app.Miles" />
                                        }
                                    />
                                    <FormControlLabel
                                        value="h"
                                        control={<Radio />}
                                        label={
                                            <FormattedMessage id="app.Hours" />
                                        }
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box sx={sx.paddingTop}>
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                disabled={
                                    !newTrailer?.name ||
                                    !newTrailer?.type ||
                                    !newTrailer?.units
                                }
                                type="submit"
                                isLoading={newTrailerLoading}
                                fullWidth
                            >
                                <FormattedMessage id="app.AddTrailer" />
                            </LoadingButton>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    )
}

export default AddTrailerView
