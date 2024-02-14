import { useState, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Drawer,
    Paper,
    IconButton,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Divider,
    TextField,
    Tooltip,
    CircularProgress,
} from '@mui/material'
import {
    Close,
    Edit,
    Visibility,
    Delete,
    NotificationsActive,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { FormattedMessage } from 'react-intl'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import sx from './styles/EditTrailer.sx'
import { EditTrailerProps } from './types'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import useEditTrailer from './hooks/useEditTrailer'
import Confirm from '@/components/common/Confirm/Confirm'
import Overflow from '@/components/common/Overflow/Overflow'
import { AddMaintenance } from '@/components/maintenance/components/AddMaintenance/AddMaintenance'
import { EditMaintenance } from '@/components/maintenance/components/EditMaintenance/EditMaintenance'
import { GroupsSelect } from '@/components/common/Group/components/GroupsSelect/GroupsSelect'
import TextareaAutoSize from '@/components/common/TextareaAutoSize/TextAreaAutoSize'
import { Documents } from '@/components/common/Documents/Documents'
import Maintenance from 'pages/maintenance/[[...index]]'
import MaintenanceStatus from '@/components/maintenance/components/MaintenanceStatus/MaintenanceStatus'

const EditTrailer = ({ trailer, edit }: EditTrailerProps) => {
    const router = useRouter()
    const {
        saveTrailerField,
        editedTrailer,
        setEditedTrailer,
        reset,
        deleteTrailer,
        maintenances,
    } = useEditTrailer(trailer)
    const allGroups = useSelector((state: RootState) => state.groups)
    const { settings } = useSelector((state: RootState) => state.settings)
    const [editMaintenanceId, setEditMaintenanceId] = useState<
        number | undefined
    >()
    const [confirmDeleteTrailer, setConfirmDeleteTrailer] = useState(false)
    const [editMaintenanceField, setEditMaintenanceField] = useState<string>()

    const handleEditMaintenanceOpen = useCallback((id: number | undefined) => {
        setEditMaintenanceId(id)
    }, [])

    return (
        <Drawer
            open={Boolean(trailer?.key)}
            anchor="right"
            onClose={() => router.push('/trailers')}
        >
            {!trailer && (
                <Box display="flex" justifyContent="center" p={2} sx={sx.wrap}>
                    <NextLink href={'/trailers'}>
                        <IconButton size="small" sx={sx.edit}>
                            <Close />
                        </IconButton>
                    </NextLink>
                    <Typography>
                        <FormattedMessage id="app.TrailerNotFound" />
                    </Typography>
                </Box>
            )}
            {trailer && (
                <Box sx={sx.wrap}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">
                            <FormattedMessage id="app.Details" />
                        </Typography>
                        <NextLink href={'/trailers'}>
                            <IconButton size="small">
                                <Close />
                            </IconButton>
                        </NextLink>
                    </Box>
                    <Paper sx={sx.paper}>
                        {edit !== 'name' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Name" />
                                </Typography>
                                <Overflow
                                    text={trailer?.name || '-'}
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
                                                `/trailers/${trailer?.key}/name`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'name' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveTrailerField('name')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Name" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Name" />}
                                    value={editedTrailer?.name || ''}
                                    onChange={(event) => {
                                        setEditedTrailer({
                                            ...trailer,
                                            name: event.target.value || '',
                                        })
                                    }}
                                    fullWidth
                                    sx={sx.select}
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        trailer.name === editedTrailer?.name ||
                                        !editedTrailer?.name
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
                                                `/trailers/${trailer?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        <Box sx={sx.flex}>
                            <Box sx={sx.left}>
                                <FormattedMessage id="app.Type" />
                                <Typography variant="h6">
                                    {trailer?.type ? (
                                        <FormattedMessage
                                            id={`app.TrailerType.${trailer?.type}`}
                                        />
                                    ) : (
                                        '-'
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'mileage' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/trailers/${trailer?.key}/mileage`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography sx={sx.textWrap}>
                                    <FormattedMessage id="app.Mileage" />
                                </Typography>
                                <Box
                                    display="flex"
                                    alignItems="baseline"
                                    gap={1}
                                >
                                    <Overflow
                                        text={trailer?.mileage || '-'}
                                        variant="h6"
                                    />
                                    <Typography>
                                        {editedTrailer?.units === 'km' ? (
                                            <FormattedMessage id="app.Km" />
                                        ) : editedTrailer?.units === 'm' ? (
                                            <FormattedMessage id="app.Mi" />
                                        ) : (
                                            <FormattedMessage id="app.Hrs" />
                                        )}
                                    </Typography>
                                </Box>
                            </>
                        )}
                        {edit === 'mileage' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveTrailerField('mileage')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Mileage" />
                                </Typography>
                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            router.push(
                                                `/trailers/${trailer?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.Mileage" />
                                    }
                                    value={editedTrailer?.mileage || ''}
                                    onChange={(event) =>
                                        setEditedTrailer({
                                            ...trailer,
                                            mileage: +event.target.value,
                                        })
                                    }
                                    sx={sx.select}
                                    fullWidth
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                            max: 999999999,
                                        },
                                        endAdornment: (
                                            <FormattedMessage
                                                id={
                                                    editedTrailer?.units ===
                                                    'km'
                                                        ? 'app.Km'
                                                        : editedTrailer?.units ===
                                                          'm'
                                                        ? 'app.Mi'
                                                        : 'app.Hrs'
                                                }
                                            />
                                        ),
                                    }}
                                />
                                <Button
                                    color="primary"
                                    disabled={
                                        (editedTrailer?.mileage &&
                                            +editedTrailer?.mileage) ===
                                        (trailer?.mileage && +trailer.mileage)
                                    }
                                    type="submit"
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'groups' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/trailers/${trailer?.key}/groups`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography>
                                    <FormattedMessage id="app.Groups" />
                                </Typography>
                                {trailer.groups
                                    ? trailer.groups.map((g) => {
                                          const group = allGroups.find(
                                              (gr) => gr.key === g
                                          )
                                          return (
                                              group?.name && (
                                                  <Box key={group?.key}>
                                                      <Overflow
                                                          text={group.name}
                                                          variant="h6"
                                                      />
                                                      <Typography
                                                          variant="caption"
                                                          sx={sx.textWrap}
                                                      >
                                                          {group?.description ||
                                                              '-'}
                                                      </Typography>
                                                  </Box>
                                              )
                                          )
                                      })
                                    : '-'}
                            </>
                        )}
                        {edit === 'groups' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Groups" />
                                </Typography>
                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            router.push(
                                                `/trailers/${trailer?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <GroupsSelect
                                    groups={editedTrailer?.groups || []}
                                    setGroups={(groups) =>
                                        setEditedTrailer({
                                            ...trailer,
                                            groups,
                                        })
                                    }
                                    type="trailer"
                                    sx={sx.select}
                                    multiple
                                />
                                <Button
                                    color="primary"
                                    onClick={() => saveTrailerField('groups')}
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </Box>
                        )}
                    </Paper>
                    <Documents type="trailer" typeId={trailer.key} />
                    <Paper sx={sx.paper}>
                        {edit !== 'notes' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/trailers/${trailer?.key}/notes`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography>
                                    <FormattedMessage id="app.Notes" />
                                </Typography>
                                {trailer.notes && (
                                    <Box sx={sx.fixedHeight}>
                                        <Typography
                                            sx={{
                                                whiteSpace: 'pre-line',
                                                wordBreak: 'break-all',
                                                fontSize: 14,
                                            }}
                                            mt={2}
                                        >
                                            {trailer.notes}
                                        </Typography>
                                    </Box>
                                )}
                                {!trailer.notes && (
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        mb={2}
                                    >
                                        <Typography>
                                            <FormattedMessage id="app.NoNotes" />
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        )}
                        {edit === 'notes' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveTrailerField('notes')
                                }}
                            >
                                <Typography mb={2}>
                                    <FormattedMessage id="app.Notes" />
                                </Typography>
                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            router.push(
                                                `/trailers/${trailer?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <TextareaAutoSize
                                    value={editedTrailer?.notes || ''}
                                    onChange={(event) =>
                                        setEditedTrailer({
                                            ...trailer,
                                            notes: event.target.value,
                                        })
                                    }
                                    maxRows={16}
                                />
                                <Button color="primary" type="submit">
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        <Typography>
                            <FormattedMessage id="app.Maintenance" />
                        </Typography>
                        <Box sx={sx.edit}>
                            <AddMaintenance
                                vehicleId={trailer.key}
                                units={trailer.units || settings.units}
                                isTrailer
                            />
                        </Box>
                        {maintenances &&
                            maintenances.length > 0 &&
                            (maintenances?.[0]?.key === 'loading' ? (
                                <Box sx={sx.loading}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <Box sx={sx.fixedHeight}>
                                    <MuiTable size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    sx={sx.smallCellHead}
                                                >
                                                    &nbsp;
                                                </TableCell>
                                                <TableCell
                                                    sx={sx.smallCellHead}
                                                >
                                                    <FormattedMessage id="app.Date" />
                                                </TableCell>
                                                <TableCell
                                                    sx={sx.smallCellHead}
                                                >
                                                    <FormattedMessage id="app.Type" />
                                                </TableCell>
                                                <TableCell
                                                    sx={sx.smallCellHead}
                                                >
                                                    <FormattedMessage id="app.Cost" />
                                                </TableCell>
                                                <TableCell
                                                    sx={sx.smallCellHead}
                                                >
                                                    &nbsp;
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {maintenances.map((m, i) => (
                                                <TableRow key={i}>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                    >
                                                        <MaintenanceStatus
                                                            maintenance={m}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                    >
                                                        {m.date &&
                                                            format(
                                                                new Date(
                                                                    +m.date
                                                                ),
                                                                'dd/MM/yyyy'
                                                            )}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                        style={{
                                                            maxWidth: '160px',
                                                        }}
                                                    >
                                                        <Overflow
                                                            text={m.type || ''}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                        style={{
                                                            maxWidth: '90px',
                                                        }}
                                                    >
                                                        <Overflow
                                                            text={m.cost || ''}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                        align="right"
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleEditMaintenanceOpen(
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </MuiTable>
                                </Box>
                            ))}
                        <EditMaintenance
                            maintenance={
                                typeof editMaintenanceId === 'number'
                                    ? maintenances?.[editMaintenanceId]
                                    : undefined
                            }
                            edit={editMaintenanceField}
                            onClose={() => setEditMaintenanceId(undefined)}
                            onCancel={() => setEditMaintenanceField(undefined)}
                            onEdit={(field) => setEditMaintenanceField(field)}
                        />
                        {(!maintenances || maintenances.length === 0) && (
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Typography>
                                    <FormattedMessage id="app.NoMaintenances" />
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                    <Divider />
                    <LoadingButton
                        sx={sx.warn}
                        onClick={() => setConfirmDeleteTrailer(true)}
                        startIcon={<Delete />}
                        color="secondary"
                        fullWidth
                    >
                        <FormattedMessage id="app.DeleteTrailer" />
                    </LoadingButton>
                    <Confirm
                        onCancel={() => setConfirmDeleteTrailer(false)}
                        onSubmit={() => {
                            deleteTrailer()
                            setConfirmDeleteTrailer(false)
                        }}
                        isOpen={confirmDeleteTrailer}
                        message={
                            <FormattedMessage
                                id="app.Deleting"
                                values={{
                                    name: (
                                        <Overflow text={trailer.name || ''} />
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

export default EditTrailer
