import React from 'react'
import { Box } from '@mui/material'
import Navigation from './components/Navigation/Navigation'
import Header from './components/Header/Header'
import sx from './styles/Layout.sx'

type useLayout = {
    children: React.ReactNode
}

type LayoutProps = {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }: useLayout) => {
    return (<>
        <Header />
        <Box sx={sx.wrap}>
          <Navigation />
          <Box sx={sx.page}>
            { children }
          </Box>
        </Box>
    </>)
}

export default Layout