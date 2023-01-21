import { useMemo } from 'react'
import {
    Box,
    IconButton,
    Typography,
    Popover,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    ListItemAvatar,
    Avatar,
} from '@mui/material'
import { NotificationsActive, ReceiptLong } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import { formatRelative } from 'date-fns'
import { bg, enUS } from 'date-fns/locale'
import Link from 'next/link'
import Head from 'next/head'
import sx from './styles/Notifications.sx'
import useNotifications from './hooks/useNotifications'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { NotificationItem } from './types'

const unreadMsgs = [
    {
        id: 1,
        title: 'Title',
        message: 'Message',
        timeCreated: 1670602365240,
        url: '/invoices',
    },
    {
        id: 2,
        title: 'Title 2',
        message: 'Message 2',
        timeCreated: 1670501365240,
        url: '/invoices',
    },
    {
        id: 3,
        title: 'Title 3',
        message: 'Message 3',
        timeCreated: 1633005321168,
        url: '/invoices',
    },
]

const readMsgs = [
    {
        id: 1,
        title: 'Title',
        message: 'Message',
        timeCreated: 1586774169772,
        url: '/invoices',
    },
    {
        id: 2,
        title: 'Title 2',
        message: 'Message 2',
        timeCreated: 1586774169772,
        url: '/invoices',
    },
    {
        id: 3,
        title: 'Title 3',
        message: 'Message 3',
        timeCreated: 1586774169772,
        url: '/invoices',
    },
    {
        id: 4,
        title: 'Title',
        message: 'Message',
        timeCreated: 1586774169772,
        url: '/invoices',
    },
    {
        id: 5,
        title: 'Title 2',
        message: 'Message 2',
        timeCreated: 1586774169772,
        url: '/invoices',
    },
    {
        id: 6,
        title: 'Title 3',
        message: 'Message 3',
        timeCreated: 1586774169772,
        url: '/invoices',
    },
    {
        id: 7,
        title: 'Title',
        message: 'Message',
        timeCreated: 1586774169772,
        url: '/invoices',
    },
    {
        id: 8,
        title: 'Title 2',
        message: 'Message 2',
        timeCreated: 1586774169772,
        url: '/invoices',
    },
    {
        id: 9,
        title: 'Title 3',
        message: 'Message 3',
        timeCreated: 1586774169772,
        url: '/invoices',
    },
]

const hasNotifications = true

const Notifications = () => {
    const { anchorEl, handleClick, handleClose } = useNotifications()
    const { settings } = useSelector((state: RootState) => state.settings)
    const locale = useMemo(() => {
        switch (settings?.locale) {
            case 'bg':
                return bg
            default:
                return enUS
        }
    }, [settings?.locale])

    const renderItem = (item: NotificationItem) => {
        const { id, title, message, timeCreated, url } = item

        return (
            <ListItem key={id} sx={sx.item}>
                <Link
                    href={url}
                    style={{ textDecoration: 'none', width: '100%' }}
                >
                    <Box sx={sx.link}>
                        <ListItemAvatar sx={sx.avatar}>
                            <Box sx={sx.avatar}>
                                <Avatar>
                                    <ReceiptLong />
                                </Avatar>
                                <Typography sx={sx.time}>
                                    {formatRelative(
                                        new Date(timeCreated),
                                        new Date(),
                                        { locale }
                                    )}
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
            <Head>
                <title>Trucky.one</title>
                {hasNotifications ? (
                    <>
                        <link
                            rel="apple-touch-icon"
                            sizes="57x57"
                            href="/icons/notification/apple-icon-57x57.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="60x60"
                            href="/icons/notification/apple-icon-60x60.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="72x72"
                            href="/icons/notification/apple-icon-72x72.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="76x76"
                            href="/icons/notification/apple-icon-76x76.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="114x114"
                            href="/icons/notification/apple-icon-114x114.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="120x120"
                            href="/icons/notification/apple-icon-120x120.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="144x144"
                            href="/icons/notification/apple-icon-144x144.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="152x152"
                            href="/icons/notification/apple-icon-152x152.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="180x180"
                            href="/icons/notification/apple-icon-180x180.png"
                        />
                        <link
                            rel="icon"
                            type="image/png"
                            sizes="192x192"
                            href="/icons/notification/android-icon-192x192.png"
                        />
                        <link
                            rel="icon"
                            type="image/png"
                            sizes="32x32"
                            href="/icons/notification/favicon-32x32.png"
                        />
                        <link
                            rel="icon"
                            type="image/png"
                            sizes="96x96"
                            href="/icons/notification/favicon-96x96.png"
                        />
                        <link
                            rel="icon"
                            type="image/png"
                            sizes="16x16"
                            href="/icons/notification/favicon-16x16.png"
                        />
                        <link
                            rel="manifest"
                            href="/icons/notification/manifest.json"
                        />
                        <meta
                            name="msapplication-TileColor"
                            content="#ffffff"
                        />
                        <meta
                            name="msapplication-TileImage"
                            content="/icons/notification/ms-icon-144x144.png"
                        />
                        <meta name="theme-color" content="#ffffff" />
                    </>
                ) : (
                    <>
                        <link
                            rel="apple-touch-icon"
                            sizes="57x57"
                            href="/icons/fav/apple-icon-57x57.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="60x60"
                            href="/icons/fav/apple-icon-60x60.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="72x72"
                            href="/icons/fav/apple-icon-72x72.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="76x76"
                            href="/icons/fav/apple-icon-76x76.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="114x114"
                            href="/icons/fav/apple-icon-114x114.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="120x120"
                            href="/icons/fav/apple-icon-120x120.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="144x144"
                            href="/icons/fav/apple-icon-144x144.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="152x152"
                            href="/icons/fav/apple-icon-152x152.png"
                        />
                        <link
                            rel="apple-touch-icon"
                            sizes="180x180"
                            href="/icons/fav/apple-icon-180x180.png"
                        />
                        <link
                            rel="icon"
                            type="image/png"
                            sizes="192x192"
                            href="/icons/fav/android-icon-192x192.png"
                        />
                        <link
                            rel="icon"
                            type="image/png"
                            sizes="32x32"
                            href="/icons/fav/favicon-32x32.png"
                        />
                        <link
                            rel="icon"
                            type="image/png"
                            sizes="96x96"
                            href="/icons/fav/favicon-96x96.png"
                        />
                        <link
                            rel="icon"
                            type="image/png"
                            sizes="16x16"
                            href="/icons/fav/favicon-16x16.png"
                        />
                        <link rel="manifest" href="/icons/fav/manifest.json" />
                        <meta
                            name="msapplication-TileColor"
                            content="#ffffff"
                        />
                        <meta
                            name="msapplication-TileImage"
                            content="/icons/fav/ms-icon-144x144.png"
                        />
                        <meta name="theme-color" content="#ffffff" />
                    </>
                )}
            </Head>
            <Tooltip title={<FormattedMessage id="app.Notifications" />}>
                <IconButton onClick={handleClick} sx={sx.notifications}>
                    <NotificationsActive />
                    <Typography sx={sx.notificationsCount}>9+</Typography>
                </IconButton>
            </Tooltip>
            <Popover
                id="notifications"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <List sx={sx.notificationsList}>
                    {unread.length > 0 && (
                        <>
                            <ListItem sx={sx.gray}>
                                <ListItemText
                                    secondary={
                                        <FormattedMessage id="app.Recent" />
                                    }
                                />
                            </ListItem>
                            {unread}
                        </>
                    )}
                    {read.length > 0 && (
                        <>
                            <ListItem sx={sx.gray}>
                                <ListItemText
                                    secondary={
                                        <FormattedMessage id="app.Older" />
                                    }
                                />
                            </ListItem>
                            {read}
                        </>
                    )}
                    {!unread.length && !read.length && (
                        <Box textAlign="center" m={1}>
                            <Typography>No notifications yet...</Typography>
                        </Box>
                    )}
                </List>
            </Popover>
        </>
    )
}
export default Notifications
