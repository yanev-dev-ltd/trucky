import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    Drawer,
    Paper,
    IconButton,
    Divider,
    TextField,
    Tooltip,
    Autocomplete,
} from '@mui/material'
import { Close, Edit, Delete } from '@mui/icons-material'
import { useRouter } from 'next/router'
import sx from '../styles/EditMaintenance.sx'
import NextLink from 'next/link'
import { FormattedMessage, useIntl } from 'react-intl'
import Confirm from '@/components/common/Confirm/Confirm'
import Overflow from '@/components/common/Overflow/Overflow'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { EditMaintenanceProps } from '../types'
import { MaintenanceTypes } from '@/components/maintenance/types'

const EditMaintenanceView = ({
    maintenance,
    edit,
    reset,
    saveMaintenanceField,
    setEditedMaintenance,
    editedMaintenance,
    deleteMaintenance,
}: EditMaintenanceProps) => {
    const router = useRouter()
    const intl = useIntl()
    const [confirmDeleteMaintenance, setConfirmDeleteMaintenance] =
        useState<boolean>(false)

    return (
        <Drawer
            open={Boolean(maintenance?.key)}
            anchor="right"
            onClose={() => router.push('/maintenance')}
        >
            {!maintenance && (
                <Box display="flex" justifyContent="center" p={2} sx={sx.wrap}>
                    <NextLink href={'/maintenance'}>
                        <IconButton size="small" sx={sx.edit}>
                            <Close />
                        </IconButton>
                    </NextLink>
                    <Typography>
                        <FormattedMessage id="app.MaintenanceNotFound" />
                    </Typography>
                </Box>
            )}
            {maintenance && (
                <Box sx={sx.wrap}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">
                            <FormattedMessage id="app.Details" />
                        </Typography>
                        <NextLink href={'/maintenance'}>
                            <IconButton size="small">
                                <Close />
                            </IconButton>
                        </NextLink>
                    </Box>
                    <Paper sx={sx.paper}>
                        {edit !== 'type' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Type" />
                                </Typography>
                                <Overflow
                                    text={maintenance?.type || '-'}
                                    variant="h6"
                                />
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/maintenance/${maintenance?.key}/type`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'type' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveMaintenanceField('type')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Type" />
                                </Typography>
                                <Autocomplete
                                    value={maintenance?.type || ''}
                                    onChange={(event, newValue) => {
                                        setEditedMaintenance({
                                            ...maintenance,
                                            type: newValue || '',
                                        })
                                    }}
                                    options={[
                                        ...Object.values(MaintenanceTypes).map(
                                            (type) =>
                                                intl.formatMessage({
                                                    id: `app.MaintenanceType.${type}`,
                                                })
                                        ),
                                    ]}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            onChange={(event) =>
                                                setEditedMaintenance({
                                                    ...maintenance,
                                                    type:
                                                        event.target.value ||
                                                        '',
                                                })
                                            }
                                        />
                                    )}
                                    freeSolo
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        maintenance.type ===
                                            editedMaintenance?.type ||
                                        !editedMaintenance?.type
                                    }
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            router.push(
                                                `/maintenance/${maintenance?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Divider />
                    <LoadingButton
                        sx={sx.warn}
                        onClick={() => setConfirmDeleteMaintenance(true)}
                        startIcon={<Delete />}
                        color="secondary"
                        fullWidth
                    >
                        <FormattedMessage id="app.DeleteMaintenance" />
                    </LoadingButton>
                    <Confirm
                        onCancel={() => setConfirmDeleteMaintenance(false)}
                        onSubmit={() => {
                            deleteMaintenance()
                            setConfirmDeleteMaintenance(false)
                        }}
                        isOpen={confirmDeleteMaintenance}
                        message={
                            <FormattedMessage
                                id="app.Deleting"
                                values={{
                                    name: (
                                        <Overflow
                                            text={maintenance.type || ''}
                                        />
                                    ),
                                }}
                            />
                        }
                        type="warn"
                        submit={<FormattedMessage id="app.Delete" />}
                        cancel={<FormattedMessage id="app.Cancel" />}
                    />
                </Box>
            )}
        </Drawer>
    )
}

export default EditMaintenanceView
