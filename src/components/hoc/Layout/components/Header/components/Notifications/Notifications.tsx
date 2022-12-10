import { Box, IconButton, Typography, Popover, List, ListItem, ListItemText, Tooltip, ListItemAvatar, Avatar } from '@mui/material'
import { NotificationsActive, ReceiptLong } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import { formatRelative } from 'date-fns'
import { bg, enUS } from 'date-fns/locale'
import Link from 'next/link'
import sx from './styles/Notifications.sx'
import useNotifications from './hooks/useNotifications'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../../../store/store'
import { NotificationItem } from './types'

const unreadMsgs = [
    {
        id: 1,
        title: 'Title',
        message: 'Message',
        timeCreated: 1670602365240,
        url: '/invoices'
    },
    {
        id: 2,
        title: 'Title 2',
        message: 'Message 2',
        timeCreated: 1670501365240,
        url: '/invoices'
    },
    {
        id: 3,
        title: 'Title 3',
        message: 'Message 3',
        timeCreated: 1633005321168,
        url: '/invoices'
    }
]

const readMsgs = [
    {
        id: 1,
        title: 'Title',
        message: 'Message',
        timeCreated: 1586774169772,
        url: '/invoices'
    },
    {
        id: 2,
        title: 'Title 2',
        message: 'Message 2',
        timeCreated: 1586774169772,
        url: '/invoices'
    },
    {
        id: 3,
        title: 'Title 3',
        message: 'Message 3',
        timeCreated: 1586774169772,
        url: '/invoices'
    },
    {
        id: 4,
        title: 'Title',
        message: 'Message',
        timeCreated: 1586774169772,
        url: '/invoices'
    },
    {
        id: 5,
        title: 'Title 2',
        message: 'Message 2',
        timeCreated: 1586774169772,
        url: '/invoices'
    },
    {
        id: 6,
        title: 'Title 3',
        message: 'Message 3',
        timeCreated: 1586774169772,
        url: '/invoices'
    },
    {
        id: 7,
        title: 'Title',
        message: 'Message',
        timeCreated: 1586774169772,
        url: '/invoices'
    },
    {
        id: 8,
        title: 'Title 2',
        message: 'Message 2',
        timeCreated: 1586774169772,
        url: '/invoices'
    },
    {
        id: 9,
        title: 'Title 3',
        message: 'Message 3',
        timeCreated: 1586774169772,
        url: '/invoices'
    }
]

const Notifications = () => {
    const { anchorEl, handleClick, handleClose } = useNotifications()
    const settings = useSelector((state: RootState) => state.settings)

    const renderItem = (item: NotificationItem) => {
        const { id, title, message, timeCreated, url } = item;
    
        return (
          <ListItem key={id} sx={sx.item}>
            <Link href={url} style={{ textDecoration: 'none', width: '100%' }}>
                <Box sx={sx.link}>
                    <ListItemAvatar sx={sx.avatar}>
                    <Box sx={sx.avatar}>
                        <Avatar><ReceiptLong /></Avatar>
                        <Typography sx={sx.time}>
                            {formatRelative(new Date(timeCreated), new Date(), { locale: settings?.settings?.locale === 'bg' ? bg : enUS })}
                        </Typography>
                    </Box>
                    </ListItemAvatar>
                    <Box style={{ flex: 1 }}>
                        <ListItemText primary={title} secondary={message} />
                    </Box>
                </Box>
            </Link>
          </ListItem>
        )
    }

    const unread = unreadMsgs.map(renderItem)
    const read = readMsgs.map(renderItem)
    return (
        <>
            <Tooltip title={<FormattedMessage id='app.Notifications' />}>
                <IconButton onClick={handleClick} sx={sx.notifications}><NotificationsActive /><Typography sx={sx.notificationsCount}>9</Typography></IconButton>
            </Tooltip>
            <Popover
            id='notifications'
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            >
                <List sx={sx.notificationsList}>
                    {unread.length > 0 && (
                    <>
                        <ListItem sx={sx.gray}>
                            <ListItemText secondary={<FormattedMessage id='app.Recent' />} />
                        </ListItem>
                        {unread}
                    </>
                    )}
                    {read.length > 0 && (
                    <>
                        <ListItem sx={sx.gray}>
                            <ListItemText secondary={<FormattedMessage id='app.Older' />} />
                        </ListItem>
                        {read}
                    </>
                    )}
                    {!unread.length && !read.length && (
                    <Box textAlign='center' m={1}>
                        <Typography>No notifications yet...</Typography>
                    </Box>
                    )}
                </List>
            </Popover>
        </>
    )
}
export default Notifications