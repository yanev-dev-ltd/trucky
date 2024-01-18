import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGroupsViewProps } from '../types'

const useGroupsView = ({ groups }: useGroupsViewProps) => {
    const allGroups = useSelector((state: RootState) => state.groups)
    const selectedGroups = allGroups.filter((d) => groups.includes(d.key || '')) || []

    return { groups: selectedGroups }
}

export default useGroupsView