import { ReactNode, FC } from 'react'
import { Box } from '@mui/material'
import Navigation from './components/Navigation/Navigation'
import Header from './components/Header/Header'
import sx from './styles/Layout.sx'

type useLayout = {
    children: ReactNode
}

type LayoutProps = {
    children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }: useLayout) => {
    return (
        <>
            <Header />
            <Box sx={sx.wrap}>
                <Navigation />
                <Box sx={sx.page}>{children}</Box>
            </Box>
        </>
    )
}

export default Layout
