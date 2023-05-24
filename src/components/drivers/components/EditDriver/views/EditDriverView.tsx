import { useState, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    Drawer,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    TextField,
    Tooltip,
} from '@mui/material'
import { Close, Edit, InsertDriveFile, Delete } from '@mui/icons-material'
import { useRouter } from 'next/router'
import sx from '../styles/EditDriver.sx'
import NextLink from 'next/link'
import { FormattedMessage } from 'react-intl'
import Upload from '@/components/common/Upload/Upload'
import { UploadedFile } from '@/components/common/Upload/types'
import Confirm from '@/components/common/Confirm/Confirm'
import Overflow from '@/components/common/Overflow/Overflow'
import { auth } from '@/services/firebase'
import { bg, enUS } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { formatRelative } from 'date-fns'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { EditDriverProps } from '../types'

const EditDriverView = ({
    driver,
    edit,
    reset,
    saveDriverField,
    setEditedDriver,
    editedDriver,
    downloadFile,
    deleteFile,
    deleteDriver,
}: EditDriverProps) => {
    const router = useRouter()
    const [confirmDeleteFile, setConfirmDeleteFile] = useState<
        UploadedFile | undefined
    >()
    const [confirmDeleteDriver, setConfirmDeleteDriver] =
        useState<boolean>(false)
    const { settings } = useSelector((state: RootState) => state.settings)
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
                    <Paper sx={sx.paper}>
                        <Box sx={sx.edit}>
                            <Upload
                                filepath={
                                    auth?.currentUser?.uid
                                        ? `user/${auth?.currentUser?.uid}/drivers`
                                        : undefined
                                }
                                dbpath={
                                    auth?.currentUser?.uid
                                        ? `drivers/${auth.currentUser.uid}/${driver?.key}`
                                        : undefined
                                }
                                currentFiles={driver?.files || []}
                            />
                        </Box>
                        <Typography>
                            <FormattedMessage id="app.Documents" />
                        </Typography>
                        <List dense sx={sx.fixedHeight}>
                            {driver?.files &&
                                driver?.files.length > 0 &&
                                driver?.files.map((uf, i) => (
                                    <ListItem
                                        key={i}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() =>
                                                    setConfirmDeleteFile(uf)
                                                }
                                            >
                                                <Delete />
                                            </IconButton>
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton
                                            onClick={() => downloadFile(uf)}
                                        >
                                            <ListItemIcon>
                                                <InsertDriveFile />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Overflow text={uf.name} />
                                                }
                                                secondary={formatRelative(
                                                    new Date(uf.date),
                                                    new Date(),
                                                    { locale }
                                                )}
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                        </List>
                        <Confirm
                            onCancel={() => setConfirmDeleteFile(undefined)}
                            onSubmit={() => {
                                confirmDeleteFile &&
                                    deleteFile(
                                        confirmDeleteFile,
                                        `drivers/${auth?.currentUser?.uid}/${driver.key}`,
                                        driver.files || []
                                    )
                                setConfirmDeleteFile(undefined)
                            }}
                            isOpen={Boolean(confirmDeleteFile)}
                            message={
                                <FormattedMessage
                                    id="app.DeleteFileConfirm"
                                    values={{
                                        file: (
                                            <Overflow
                                                text={
                                                    confirmDeleteFile?.name ||
                                                    ''
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
                        {(!driver?.files || driver?.files.length === 0) && (
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Typography>
                                    <FormattedMessage id="app.NoDocuments" />
                                </Typography>
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
