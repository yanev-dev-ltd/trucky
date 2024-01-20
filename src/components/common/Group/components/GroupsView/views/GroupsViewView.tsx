import { Fragment } from 'react'
import { Tooltip, List, ListItemText, Divider } from '@mui/material'
import { GroupWork } from '@mui/icons-material'
import { GroupsViewViewProps } from '../types'
import { FormattedMessage } from 'react-intl'

const GroupsViewView = ({ groups }: GroupsViewViewProps) => {
    if (groups.filter((g) => g).length === 0 || !groups)
        return (
            <Tooltip
                title={<FormattedMessage id="app.NoGroups" />}
                placement="right"
            >
                <GroupWork color="disabled" />
            </Tooltip>
        )
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
