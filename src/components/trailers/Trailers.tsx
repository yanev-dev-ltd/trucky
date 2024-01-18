import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useTrailers from './hooks/useTrailers'
import { TrailersView } from './views/TrailersView'
import { useTrailersProps } from './types'

export const Trailers: FC<useTrailersProps> = wrap(TrailersView, useTrailers)
