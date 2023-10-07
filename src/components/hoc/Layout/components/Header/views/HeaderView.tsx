import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Fullscreen, FullscreenExit, Logout } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '@/services/firebase'
import sx from '../styles/Header.sx'
import Image from 'next/image'
import { HeaderProps } from '../types'
import Notifications from '../components/Notifications/Notifications'
import useSubscription from '@/hooks/useSubscription'

export const HeaderView = ({
    handleFullscreen,
    fullscreen,
}: HeaderProps): JSX.Element => {
    const { subscription } = useSubscription()
    return (
        <Box sx={sx.header}>
            <Box sx={sx.logo}>
                <Link
                    href={
                        subscription === 'inactive'
                            ? '/settings'
                            : subscription === 'active'
                            ? '/'
                            : '/custom'
                    }
                >
                    <Image
                        src="/icons/logo.svg"
                        alt="Trucky.one - manage your fleet"
                        width={150}
                        height={24}
                        priority
                    />
                </Link>
            </Box>
            {subscription === 'inactive' && (
                <Link
                    href="/settings/invoices"
                    style={{
                        color: '#fff',
                        textDecoration: 'none',
                    }}
                >
                    <Typography sx={sx.message}>
                        <FormattedMessage id="app.PaymentNeeded" />
                    </Typography>
                </Link>
            )}
            <Box sx={sx.buttons}>
                <Tooltip
                    title={
                        fullscreen ? (
                            <FormattedMessage id="app.ExitFullscreen" />
                        ) : (
                            <FormattedMessage id="app.Fullscreen" />
                        )
                    }
                >
                    <IconButton onClick={handleFullscreen}>
                        {fullscreen ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                </Tooltip>
                <Notifications />
                <Tooltip title={<FormattedMessage id="app.Logout" />}>
                    <IconButton onClick={() => signOut(auth)}>
                        <Logout />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}
