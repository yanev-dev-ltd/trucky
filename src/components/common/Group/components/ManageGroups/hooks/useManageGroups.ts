import { useState, useEffect } from 'react'
import { useManageGroupsProps } from '../types'

const useManageGroups = ({ groups }: useManageGroupsProps) => {
    return { groups }
}

export default useManageGroups