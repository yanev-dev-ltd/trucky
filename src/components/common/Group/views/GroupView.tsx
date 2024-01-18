import {
    Box,
    IconButton,
    Tooltip,
    Chip,
    Popover,
    List,
    ListItem,
    ListItemText,
    Button,
    TextField,
    Paper,
    ListItemButton,
} from '@mui/material'
import { GroupWork, Edit, AddCircle } from '@mui/icons-material'
import { useIntl, FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { GroupProps } from '../types'
import sx from '../styles/Group.sx'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import Confirm from '@/components/common/Confirm/Confirm'
import Overflow from '@/components/common/Overflow/Overflow'
import { useState } from 'react'
import { AddGroup } from '../components/AddGroup/AddGroup'

export const GroupView = ({
    groups,
    anchorEl,
    handleClose,
    handleClick,
    editGroupIndex,
    setEditGroupIndex,
    editGroup,
    editedGroup,
    setEditedGroup,
    editLoading,
    deleteGroup,
    type,
}: GroupProps) => {
    const intl = useIntl()
    const router = useRouter()
    const [confirmDeleteGroup, setConfirmDeleteGroup] = useState<boolean>(false)
    const [openAdd, setOpenAdd] = useState<boolean>(false)
    const selectedGroup = groups.find((g) => g.key === router.query.group)
    return (
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
            <Tooltip title={intl.formatMessage({ id: 'app.Groups' })}>
                <IconButton onClick={handleClick}>
                    <GroupWork />
                </IconButton>
            </Tooltip>
            <Popover
                id="group-popover"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <List sx={sx.groupsList}>
                    {!groups.length && (
                        <ListItem>
                            <ListItemText
                                sx={sx.noGroups}
                                primary={
                                    <FormattedMessage id="app.NoGroupsYet" />
                                }
                            />
                        </ListItem>
                    )}
                    <ListItem>
                        <Button
                            fullWidth
                            onClick={() => setOpenAdd(true)}
                            variant="outlined"
                            size="small"
                            startIcon={<AddCircle />}
                        >
                            <FormattedMessage id="app.AddGroup" />
                        </Button>
                        <AddGroup
                            type={type}
                            open={openAdd}
                            setOpen={setOpenAdd}
                            onSave={() => setOpenAdd(false)}
                        />
                    </ListItem>
                    {groups.map((group, index) => {
                        if (index === editGroupIndex) {
                            return (
                                <ListItem key={group.key}>
                                    <Paper sx={sx.paper}>
                                        <Box
                                            component="form"
                                            onSubmit={(event) => {
                                                event.preventDefault()
                                                event.stopPropagation()
                                                if (!editedGroup?.name) return
                                                editGroup()
                                            }}
                                        >
                                            <Box sx={sx.row}>
                                                <TextField
                                                    variant="outlined"
                                                    label={
                                                        <FormattedMessage id="app.Name" />
                                                    }
                                                    fullWidth
                                                    value={
                                                        editedGroup?.name || ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditedGroup({
                                                            ...editedGroup,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </Box>
                                            <Box sx={sx.row}>
                                                <TextField
                                                    variant="outlined"
                                                    label={
                                                        <FormattedMessage id="app.Description" />
                                                    }
                                                    fullWidth
                                                    value={
                                                        editedGroup?.description ||
                                                        ''
                                                    }
                                                    multiline
                                                    onChange={(e) =>
                                                        setEditedGroup({
                                                            ...editedGroup,
                                                            description:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() =>
                                                        setConfirmDeleteGroup(
                                                            true
                                                        )
                                                    }
                                                >
                                                    <FormattedMessage id="app.Delete" />
                                                </Button>
                                                <Confirm
                                                    onCancel={() =>
                                                        setConfirmDeleteGroup(
                                                            false
                                                        )
                                                    }
                                                    onSubmit={() => {
                                                        deleteGroup()
                                                        setConfirmDeleteGroup(
                                                            false
                                                        )
                                                    }}
                                                    isOpen={confirmDeleteGroup}
                                                    message={
                                                        <FormattedMessage
                                                            id="app.Deleting"
                                                            values={{
                                                                name: (
                                                                    <Overflow
                                                                        text={
                                                                            editedGroup?.name ||
                                                                            ''
                                                                        }
                                                                    />
                                                                ),
                                                            }}
                                                        />
                                                    }
                                                    type="warn"
                                                    submit={
                                                        <FormattedMessage id="app.Delete" />
                                                    }
                                                    cancel={
                                                        <FormattedMessage id="app.Cancel" />
                                                    }
                                                />
                                                <Box display="flex" gap={1}>
                                                    <Button
                                                        onClick={() =>
                                                            setEditGroupIndex(
                                                                null
                                                            )
                                                        }
                                                    >
                                                        <FormattedMessage id="app.Cancel" />
                                                    </Button>
                                                    <LoadingButton
                                                        variant="contained"
                                                        color="primary"
                                                        isLoading={editLoading}
                                                        type="submit"
                                                    >
                                                        <FormattedMessage id="app.Save" />
                                                    </LoadingButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </ListItem>
                            )
                        }
                        return (
                            <ListItem
                                key={group.key}
                                onClick={() => {
                                    router.replace({
                                        query: {
                                            ...router.query,
                                            group: group.key,
                                        },
                                    })
                                    handleClose()
                                }}
                                secondaryAction={
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setEditGroupIndex(index)
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                }
                                disablePadding
                            >
                                <ListItemButton
                                    sx={
                                        selectedGroup?.key === group.key
                                            ? sx.selected
                                            : null
                                    }
                                >
                                    <ListItemText
                                        primary={group.name}
                                        secondary={group.description}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Popover>
            {selectedGroup && (
                <Chip
                    label={selectedGroup.name}
                    onDelete={() =>
                        router.replace({
                            query: { ...router.query, group: null },
                        })
                    }
                />
            )}
        </Box>
    )
}
