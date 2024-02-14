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
import {
    NotificationsActive,
    ReceiptLong,
    NotificationsNone,
} from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import { formatRelative } from 'date-fns'
import { bg, enUS } from 'date-fns/locale'
import Link from 'next/link'
import Head from 'next/head'
import sx from './styles/Notifications.sx'
import useNotifications from './hooks/useNotifications'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Notification } from './types'

const Notifications = () => {
    const {
        anchorEl,
        handleClick,
        handleClose,
        notifications,
        hasNotifications,
        handleItemClick,
    } = useNotifications()
    const { settings } = useSelector((state: RootState) => state.settings)
    const locale = useMemo(() => {
        switch (settings?.locale) {
            case 'bg':
                return bg
            default:
                return enUS
        }
    }, [settings?.locale])

    const notificationsCount = useMemo(() => {
        const count = notifications.filter((n) => n.status === 'unread').length
        return count > 9 ? '9+' : count
    }, [notifications])

    const renderItem = (item: Notification) => {
        const { key, message, date, url, status } = item

        return (
            <ListItem key={key} sx={status === 'unread' ? sx.itemNew : sx.item}>
                <Link
                    href={url || ''}
                    style={{ textDecoration: 'none', width: '100%' }}
                    onClick={() => handleItemClick(key, url)}
                >
                    <Box sx={sx.link}>
                        <ListItemAvatar sx={sx.avatar}>
                            <Box sx={sx.avatar}>
                                {(status === 'unread' || status === 'read') && (
                                    <Box sx={sx.dot} />
                                )}
                                <Avatar
                                    sx={status === 'unread' ? sx.light : null}
                                >
                                    <ReceiptLong />
                                </Avatar>
                            </Box>
                        </ListItemAvatar>
                        <Box style={{ flex: 1 }}>
                            <ListItemText
                                primary={message?.subject}
                                secondary={
                                    <>
                                        {message?.description || null}
                                        <Box component="span" sx={sx.time}>
                                            {date &&
                                                formatRelative(
                                                    new Date(date),
                                                    new Date(),
                                                    { locale }
                                                )}
                                        </Box>
                                    </>
                                }
                            />
                        </Box>
                    </Box>
                </Link>
            </ListItem>
        )
    }

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
                    {Boolean(anchorEl) ? (
                        <NotificationsActive />
                    ) : (
                        <NotificationsNone />
                    )}
                    {notificationsCount ? (
                        <Typography sx={sx.notificationsCount}>
                            {notificationsCount}
                        </Typography>
                    ) : null}
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
                    {notifications.map(renderItem)}
                    {!notifications.length && (
                        <Box textAlign="center" m={1}>
                            <Typography>
                                <FormattedMessage id="app.NoNotificationsYet" />
                            </Typography>
                        </Box>
                    )}
                </List>
            </Popover>
        </>
    )
}
export default Notifications
