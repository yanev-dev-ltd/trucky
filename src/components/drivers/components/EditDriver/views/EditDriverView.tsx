import { useState, useMemo } from 'react'
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
} from '@mui/material'
import { Close, Edit, Delete } from '@mui/icons-material'
import { useRouter } from 'next/router'
import sx from '../styles/EditDriver.sx'
import NextLink from 'next/link'
import { FormattedMessage } from 'react-intl'
import Confirm from '@/components/common/Confirm/Confirm'
import Overflow from '@/components/common/Overflow/Overflow'
import { bg, enUS } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { EditDriverProps } from '../types'
import TextareaAutoSize from '@/components/common/TextareaAutoSize/TextAreaAutoSize'
import { GroupsSelect } from '@/components/common/Group/components/GroupsSelect/GroupsSelect'
import { Documents } from '@/components/common/Documents/Documents'

const EditDriverView = ({
    driver,
    edit,
    reset,
    saveDriverField,
    setEditedDriver,
    editedDriver,
    deleteDriver,
}: EditDriverProps) => {
    const router = useRouter()
    const [confirmDeleteDriver, setConfirmDeleteDriver] =
        useState<boolean>(false)
    const { settings } = useSelector((state: RootState) => state.settings)
    const allGroups = useSelector((state: RootState) => state.groups)
    const locale = useMemo(() => {
        switch (settings?.locale) {
            case 'bg':
                return bg
            default:
                return enUS
        }
    }, [settings?.locale])

    return (
        <Drawer
            open={Boolean(driver?.key)}
            anchor="right"
            onClose={() => router.push('/drivers')}
        >
            {!driver && (
                <Box display="flex" justifyContent="center" p={2} sx={sx.wrap}>
                    <NextLink href={'/drivers'}>
                        <IconButton size="small" sx={sx.edit}>
                            <Close />
                        </IconButton>
                    </NextLink>
                    <Typography>
                        <FormattedMessage id="app.DriverNotFound" />
                    </Typography>
                </Box>
            )}
            {driver && (
                <Box sx={sx.wrap}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">
                            <FormattedMessage id="app.Details" />
                        </Typography>
                        <NextLink href={'/drivers'}>
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
                                    text={driver?.name || '-'}
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
                                                `/drivers/${driver?.key}/name`
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
                                    saveDriverField('name')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Name" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Name" />}
                                    value={editedDriver?.name || ''}
                                    onChange={(event) => {
                                        setEditedDriver({
                                            ...driver,
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
                                        driver.name === editedDriver?.name ||
                                        !editedDriver?.name
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
                                                `/drivers/${driver?.key}`
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
                        {edit !== 'phone' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Phone" />
                                </Typography>
                                <Overflow
                                    text={driver?.phone || '-'}
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
                                                `/drivers/${driver?.key}/phone`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'phone' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveDriverField('phone')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Phone" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Phone" />}
                                    value={editedDriver?.phone || ''}
                                    onChange={(event) => {
                                        setEditedDriver({
                                            ...driver,
                                            phone: event.target.value || '',
                                        })
                                    }}
                                    fullWidth
                                    sx={sx.select}
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        driver.phone === editedDriver?.phone ||
                                        !editedDriver?.phone
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
                                                `/drivers/${driver?.key}`
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
                        {edit !== 'address' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Address" />
                                </Typography>
                                <Overflow
                                    text={driver?.address || '-'}
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
                                                `/drivers/${driver?.key}/address`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'address' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveDriverField('address')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Address" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.Address" />
                                    }
                                    value={editedDriver?.address || ''}
                                    onChange={(event) => {
                                        setEditedDriver({
                                            ...driver,
                                            address: event.target.value || '',
                                        })
                                    }}
                                    fullWidth
                                    sx={sx.select}
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        driver.address ===
                                            editedDriver?.address ||
                                        !editedDriver?.address
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
                                                `/drivers/${driver?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Documents type="driver" typeId={driver.key || ''} />
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
                                                `/drivers/${driver?.key}/groups`
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
                                {driver.groups
                                    ? driver.groups.map((g) => {
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
                                                `/drivers/${driver?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <GroupsSelect
                                    groups={editedDriver?.groups || []}
                                    setGroups={(groups) =>
                                        setEditedDriver({
                                            ...driver,
                                            groups,
                                        })
                                    }
                                    type="driver"
                                    sx={sx.select}
                                    multiple
                                />
                                <Button
                                    color="primary"
                                    onClick={() => saveDriverField('groups')}
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </Box>
                        )}
                    </Paper>
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
                                                `/drivers/${driver?.key}/notes`
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
                                {driver.notes && (
                                    <Box sx={sx.fixedHeight}>
                                        <Typography
                                            sx={{
                                                whiteSpace: 'pre-line',
                                                wordBreak: 'break-all',
                                                fontSize: 14,
                                            }}
                                            mt={2}
                                        >
                                            {driver.notes}
                                        </Typography>
                                    </Box>
                                )}
                                {!driver.notes && (
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
                                    saveDriverField('notes')
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
                                                `/drivers/${driver?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <TextareaAutoSize
                                    value={editedDriver?.notes || ''}
                                    onChange={(event) =>
                                        setEditedDriver({
                                            ...driver,
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
                    <Divider />
                    <LoadingButton
                        sx={sx.warn}
                        onClick={() => setConfirmDeleteDriver(true)}
                        startIcon={<Delete />}
                        color="secondary"
                        fullWidth
                    >
                        <FormattedMessage id="app.DeleteDriver" />
                    </LoadingButton>
                    <Confirm
                        onCancel={() => setConfirmDeleteDriver(false)}
                        onSubmit={() => {
                            deleteDriver()
                            setConfirmDeleteDriver(false)
                        }}
                        isOpen={confirmDeleteDriver}
                        message={
                            <FormattedMessage
                                id="app.Deleting"
                                values={{
                                    name: <Overflow text={driver.name || ''} />,
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

export default EditDriverView
