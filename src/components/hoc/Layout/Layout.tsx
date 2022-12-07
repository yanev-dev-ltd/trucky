import React from 'react'
import { Box } from '@mui/material'
import Navigation from './components/Navigation/Navigation'
import Header from './components/Header/Header'

type useLayout = {
    children: React.ReactNode
}

type LayoutProps = {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }: useLayout) => {
    return (<>
        <Header />
        <Box display='flex' alignItems='stretch'>
          <Navigation />
          <Box style={{ flex: 1, height: 'calc(100vh - 54px)', overflow: 'auto' }}>
            { children }
          </Box>
        </Box>
    </>)
}

export default Layout