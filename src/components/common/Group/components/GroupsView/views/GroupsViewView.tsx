import { Fragment } from 'react'
import { Tooltip, List, ListItemText, Divider } from '@mui/material'
import { GroupWork } from '@mui/icons-material'
import { GroupsViewViewProps } from '../types'

const GroupsViewView = ({ groups }: GroupsViewViewProps) => {
    if (groups.length === 0) return null
    return (
        <Tooltip
            title={
                <List disablePadding>
                    {groups.map((g, i) => (
                        <Fragment key={g?.name || '' + i}>
                            <ListItemText secondary={g.name} />
                            {i !== groups.length - 1 && (
                                <Divider component="li" />
                            )}
                        </Fragment>
                    ))}
                </List>
            }
            placement="right"
        >
            <GroupWork />
        </Tooltip>
    )
}

export default GroupsViewView
