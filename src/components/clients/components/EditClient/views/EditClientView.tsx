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
import sx from '../styles/EditClient.sx'
import NextLink from 'next/link'
import { FormattedMessage } from 'react-intl'
import Confirm from '@/components/common/Confirm/Confirm'
import Overflow from '@/components/common/Overflow/Overflow'
import { bg, enUS } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { EditClientProps } from '../types'
import TextareaAutoSize from '@/components/common/TextareaAutoSize/TextAreaAutoSize'
import { GroupsSelect } from '@/components/common/Group/components/GroupsSelect/GroupsSelect'
import { Documents } from '@/components/common/Documents/Documents'

const EditClientView = ({
    client,
    edit,
    reset,
    saveClientField,
    setEditedClient,
    editedClient,
    deleteClient,
}: EditClientProps) => {
    const router = useRouter()
    const [confirmDeleteClient, setConfirmDeleteClient] =
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
            open={Boolean(client?.key)}
            anchor="right"
            onClose={() => router.push('/clients')}
        >
            {!client && (
                <Box display="flex" justifyContent="center" p={2} sx={sx.wrap}>
                    <NextLink href={'/clients'}>
                        <IconButton size="small" sx={sx.edit}>
                            <Close />
                        </IconButton>
                    </NextLink>
                    <Typography>
                        <FormattedMessage id="app.ClientNotFound" />
                    </Typography>
                </Box>
            )}
            {client && (
                <Box sx={sx.wrap}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">
                            <FormattedMessage id="app.Details" />
                        </Typography>
                        <NextLink href={'/clients'}>
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
                                    text={client?.name || '-'}
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
                                                `/clients/${client?.key}/name`
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
                                    saveClientField('name')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Name" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Name" />}
                                    value={editedClient?.name || ''}
                                    onChange={(event) => {
                                        setEditedClient({
                                            ...client,
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
                                        client.name === editedClient?.name ||
                                        !editedClient?.name
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
                                                `/clients/${client?.key}`
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
                        {edit !== 'contactPerson' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.ContactPerson" />
                                </Typography>
                                <Overflow
                                    text={client?.contactPerson || '-'}
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
                                                `/clients/${client?.key}/contactPerson`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'contactPerson' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveClientField('contactPerson')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.ContactPerson" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.ContactPerson" />
                                    }
                                    value={editedClient?.contactPerson || ''}
                                    onChange={(event) => {
                                        setEditedClient({
                                            ...client,
                                            contactPerson:
                                                event.target.value || '',
                                        })
                                    }}
                                    fullWidth
                                    sx={sx.select}
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        client.contactPerson ===
                                            editedClient?.contactPerson ||
                                        !editedClient?.contactPerson
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
                                                `/clients/${client?.key}`
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
                                    text={client?.phone || '-'}
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
                                                `/clients/${client?.key}/phone`
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
                                    saveClientField('phone')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Phone" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Phone" />}
                                    value={editedClient?.phone || ''}
                                    onChange={(event) => {
                                        setEditedClient({
                                            ...client,
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
                                        client.phone === editedClient?.phone ||
                                        !editedClient?.phone
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
                                                `/clients/${client?.key}`
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
                        {edit !== 'email' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Email" />
                                </Typography>
                                <Overflow
                                    text={client?.email || '-'}
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
                                                `/clients/${client?.key}/email`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'email' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveClientField('email')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Email" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Email" />}
                                    value={editedClient?.email || ''}
                                    onChange={(event) => {
                                        setEditedClient({
                                            ...client,
                                            email: event.target.value || '',
                                        })
                                    }}
                                    fullWidth
                                    sx={sx.select}
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        client.email === editedClient?.email ||
                                        !editedClient?.email
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
                                                `/clients/${client?.key}`
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
                                    text={client?.address || '-'}
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
                                                `/clients/${client?.key}/address`
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
                                    saveClientField('address')
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
                                    value={editedClient?.address || ''}
                                    onChange={(event) => {
                                        setEditedClient({
                                            ...client,
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
                                        client.address ===
                                            editedClient?.address ||
                                        !editedClient?.address
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
                                                `/clients/${client?.key}`
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
                                                `/clients/${client?.key}/groups`
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
                                {client.groups
                                    ? client.groups.map((g) => {
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
                                                `/clients/${client?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <GroupsSelect
                                    groups={editedClient?.groups || []}
                                    setGroups={(groups) =>
                                        setEditedClient({
                                            ...client,
                                            groups,
                                        })
                                    }
                                    type="client"
                                    sx={sx.select}
                                    multiple
                                />
                                <Button
                                    color="primary"
                                    onClick={() => saveClientField('groups')}
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </Box>
                        )}
                    </Paper>
                    <Documents type="client" typeId={client.key} />
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
                                                `/clients/${client?.key}/notes`
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
                                {client.notes && (
                                    <Box sx={sx.fixedHeight}>
                                        <Typography
                                            sx={{
                                                whiteSpace: 'pre-line',
                                                wordBreak: 'break-all',
                                                fontSize: 14,
                                            }}
                                            mt={2}
                                        >
                                            {client.notes}
                                        </Typography>
                                    </Box>
                                )}
                                {!client.notes && (
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
                                    saveClientField('notes')
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
                                                `/clients/${client?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <TextareaAutoSize
                                    value={editedClient?.notes || ''}
                                    onChange={(event) =>
                                        setEditedClient({
                                            ...client,
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
                        onClick={() => setConfirmDeleteClient(true)}
                        startIcon={<Delete />}
                        color="secondary"
                        fullWidth
                    >
                        <FormattedMessage id="app.DeleteClient" />
                    </LoadingButton>
                    <Confirm
                        onCancel={() => setConfirmDeleteClient(false)}
                        onSubmit={() => {
                            deleteClient()
                            setConfirmDeleteClient(false)
                        }}
                        isOpen={confirmDeleteClient}
                        message={
                            <FormattedMessage
                                id="app.Deleting"
                                values={{
                                    name: <Overflow text={client.name || ''} />,
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

export default EditClientView
