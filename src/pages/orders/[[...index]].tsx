import { Orders as OrdersComponent } from '@/components/orders/Orders'
import { useRouter } from 'next/router'

export default function Orders(): JSX.Element {
    const router = useRouter()
    const orderId =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[0]
            : undefined
    return <OrdersComponent orderId={orderId} />
}
