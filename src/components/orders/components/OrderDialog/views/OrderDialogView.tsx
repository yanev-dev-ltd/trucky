import { useEffect, useState } from 'react'
import {
    Dialog,
    Box,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    IconButton,
    Grid,
    TextField,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    SelectChangeEvent,
    InputAdornment,
} from '@mui/material'
import { Close, Delete } from '@mui/icons-material'
import type { OrderDialogProps } from '../types'
import sx from '../styles/OrderDialog.sx'
import { FormattedMessage, useIntl } from 'react-intl'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import TextareaAutoSize from '@/components/common/TextareaAutoSize/TextAreaAutoSize'
import Confirm from '@/components/common/Confirm/Confirm'
import Overflow from '@/components/common/Overflow/Overflow'
import { Select as SelectComponent } from '@/components/common/Select/Select'
import { GroupsSelect } from '@/components/common/Group/components/GroupsSelect/GroupsSelect'
import { SelectRoute } from '@/components/routes/components/SelectRoute/SelectRoute'
import { Location } from '@/components/routes/types'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { Documents } from '@/components/common/Documents/Documents'

const OrderDialogView = ({
    open,
    setOpen,
    addOrder,
    editOrder,
    order,
    isNew,
    deleteOrder,
    changeField,
    locations: currentLocations,
    setNewOrder,
    routeId,
}: OrderDialogProps) => {
    const intl = useIntl()
    const [locations, setLocations] = useState<Location[]>(
        currentLocations || []
    )
    const [showDeleteOrder, setShowDeleteOrder] = useState(false)
    return (
        <Dialog open={(typeof open === 'number' && open >= 0) || open === true}>
            <DialogTitle sx={sx.header}>
                {isNew ? (
                    <FormattedMessage id="app.AddOrder" />
                ) : (
                    <FormattedMessage id="app.EditOrder" />
                )}
                <IconButton
                    onClick={() => {
                        setOpen(false)
                        setNewOrder && setNewOrder({})
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <Box
                component="form"
                onSubmit={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    if (isNew) {
                        order && addOrder && addOrder(order)
                    } else {
                        order && editOrder && editOrder(order)
                    }
                    setOpen(false)
                    setNewOrder({})
                }}
            >
                <DialogContent sx={sx.header}>
                    <Grid container spacing={2}>
                        {!routeId && (
                            <Grid size={{ xs: 12 }}>
                                <SelectRoute
                                    setFields={(fields) =>
                                        changeField('object', fields)
                                    }
                                    setLocations={(locations) =>
                                        setLocations(locations)
                                    }
                                    item={order?.routeId || ''}
                                />
                            </Grid>
                        )}
                        <Grid size={{ xs: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="order-startStop-label">
                                    <FormattedMessage id="app.StartStop" />
                                </InputLabel>
                                <Select
                                    labelId="order-startStop-label"
                                    id="order-startStop-select"
                                    value={
                                        order?.startStop?.id?.toString() || ''
                                    }
                                    label={
                                        <FormattedMessage id="app.StartStop" />
                                    }
                                    disabled={
                                        !locations || locations.length < 2
                                    }
                                    onChange={(event: SelectChangeEvent) => {
                                        changeField(
                                            'startStop',
                                            locations?.find(
                                                (location) =>
                                                    location.id ===
                                                    event.target.value
                                            )
                                        )
                                    }}
                                >
                                    {locations?.map((location, index) => (
                                        <MenuItem
                                            key={location.id}
                                            value={location.id}
                                            disabled={
                                                (order?.endStop &&
                                                    locations?.findIndex(
                                                        (l) =>
                                                            l.id ===
                                                            order?.endStop?.id
                                                    ) <= index) ||
                                                index === locations.length - 1
                                            }
                                        >{`[${location.code}] ${location.address}`}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="order-endStop-label">
                                    <FormattedMessage id="app.EndStop" />
                                </InputLabel>
                                <Select
                                    labelId="order-endStop-label"
                                    id="order-endStop-select"
                                    value={order?.endStop?.id?.toString() || ''}
                                    label={
                                        <FormattedMessage id="app.EndStop" />
                                    }
                                    disabled={
                                        !locations || locations.length < 2
                                    }
                                    onChange={(event: SelectChangeEvent) => {
                                        changeField(
                                            'endStop',
                                            locations?.find(
                                                (location) =>
                                                    location.id ===
                                                    event.target.value
                                            )
                                        )
                                    }}
                                >
                                    {locations?.map((location, index) => (
                                        <MenuItem
                                            key={location.id}
                                            value={location.id}
                                            disabled={
                                                (order?.startStop &&
                                                    locations?.findIndex(
                                                        (l) =>
                                                            l.id ===
                                                            order?.startStop?.id
                                                    ) >= index) ||
                                                index === 0
                                            }
                                        >{`[${location.code}] ${location.address}`}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={<FormattedMessage id="app.Reference" />}
                                variant="outlined"
                                value={order?.reference || ''}
                                onChange={(event) =>
                                    changeField('reference', event.target.value)
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <DesktopDatePicker
                                label={
                                    <FormattedMessage id="app.DateExecution" />
                                }
                                format="dd/MM/yyyy"
                                value={
                                    order?.dateExecution
                                        ? new Date(order.dateExecution)
                                        : null
                                }
                                onChange={(d: Date | null) =>
                                    d &&
                                    changeField('dateExecution', d.getTime())
                                }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        placeholder:
                                            intl.formatMessage({
                                                id: 'app.dd/MM/yyyy',
                                            }) || '',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <DesktopDatePicker
                                label={
                                    <FormattedMessage id="app.DateCompletion" />
                                }
                                format="dd/MM/yyyy"
                                value={
                                    order?.dateCompletion
                                        ? new Date(order.dateCompletion)
                                        : null
                                }
                                onChange={(d: Date | null) =>
                                    d &&
                                    changeField('dateCompletion', d.getTime())
                                }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        placeholder:
                                            intl.formatMessage({
                                                id: 'app.dd/MM/yyyy',
                                            }) || '',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <GroupsSelect
                                groups={order?.groups || []}
                                setGroups={(groups) =>
                                    changeField('groups', groups)
                                }
                                type="order"
                                multiple
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label={
                                    <FormattedMessage id="app.TypeOfGoods" />
                                }
                                variant="outlined"
                                value={order?.type || ''}
                                onChange={(event) =>
                                    changeField('type', event.target.value)
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label={<FormattedMessage id="app.Weight" />}
                                variant="outlined"
                                value={order?.weight || ''}
                                onChange={(event) =>
                                    changeField('weight', event.target.value)
                                }
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FormattedMessage id="app.Kg" />
                                        </InputAdornment>
                                    ),
                                }}
                                type="number"
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label={
                                    <FormattedMessage id="app.PalletsCount" />
                                }
                                variant="outlined"
                                value={order?.palletsCount || ''}
                                onChange={(event) =>
                                    changeField(
                                        'palletsCount',
                                        event.target.value
                                    )
                                }
                                type="number"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label={
                                    <FormattedMessage id="app.TemperatureRegime" />
                                }
                                variant="outlined"
                                value={order?.temperatureRegime || ''}
                                onChange={(event) =>
                                    changeField(
                                        'temperatureRegime',
                                        event.target.value
                                    )
                                }
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FormattedMessage id="app.Celsius" />
                                        </InputAdornment>
                                    ),
                                }}
                                type="number"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <SelectComponent
                                items={[order?.client || '']}
                                setItems={(clients) =>
                                    changeField('client', clients[0])
                                }
                                type="clients"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextareaAutoSize
                                placeholder={intl.formatMessage({
                                    id: 'app.Notes',
                                })}
                                value={order?.notes || ''}
                                onChange={(event) =>
                                    changeField('notes', event.target.value)
                                }
                                maxRows={8}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Documents
                                type="order"
                                typeId={order?.key || ''}
                                light
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions
                    sx={deleteOrder && !isNew ? sx.actions : sx.actionsRight}
                >
                    {deleteOrder && !isNew && (
                        <>
                            <LoadingButton
                                sx={sx.warn}
                                onClick={() => {
                                    setShowDeleteOrder(true)
                                }}
                                startIcon={<Delete />}
                                color="secondary"
                            >
                                <FormattedMessage id="app.DeleteOrder" />
                            </LoadingButton>
                            <Confirm
                                onCancel={() => setShowDeleteOrder(false)}
                                onSubmit={() => {
                                    deleteOrder()
                                    setNewOrder({})
                                    setOpen(false)
                                    setShowDeleteOrder(false)
                                }}
                                isOpen={showDeleteOrder}
                                message={
                                    <FormattedMessage
                                        id="app.Deleting"
                                        values={{
                                            name: (
                                                <Overflow
                                                    text={
                                                        order?.reference || ''
                                                    }
                                                />
                                            ),
                                        }}
                                    />
                                }
                                type="warn"
                                submit={<FormattedMessage id="app.Delete" />}
                                cancel={<FormattedMessage id="app.Cancel" />}
                            />
                        </>
                    )}

                    <Box sx={sx.gap}>
                        <Button
                            onClick={() => {
                                setOpen(false)
                                setNewOrder && setNewOrder({})
                            }}
                        >
                            <FormattedMessage id="app.Cancel" />
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={
                                !Boolean(order?.startStop) ||
                                !Boolean(order?.endStop)
                            }
                        >
                            <FormattedMessage id="app.SaveOrder" />
                        </Button>
                    </Box>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default OrderDialogView
