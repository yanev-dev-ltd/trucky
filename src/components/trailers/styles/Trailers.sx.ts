import { SxProps, Theme } from '@mui/material'

const sx: Record<string, SxProps<Theme>> = {
    padding: {
        padding: 2,
    },
    header: {
        padding: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 54px)',
    },
    search: {
        width: 300,
    },
    multiLineHeader: {
        display: 'flex',
        flexDirection: 'column',
        float: 'left',
    },
    searchKey: {
        paddingLeft: 1,
        paddingRight: 1,
    }
}

export default sx