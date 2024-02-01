import { Print } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { useReactToPrint } from 'react-to-print'
import { Route } from '@/components/routes/types'
import ComponentToPrint from '../ComponentToPrint/ComponentToPrint'

const RoutePrint = (props: {
    route: Route
    distance: number[]
    toll: number[]
    ferry: boolean[]
    units: string
}) => {
    const componentRef = useRef(null)
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    return (
        <Box>
            <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={handlePrint}
            >
                <FormattedMessage id="app.Print" />
            </Button>
            <ComponentToPrint {...props} ref={componentRef} />
        </Box>
    )
}

export default RoutePrint
