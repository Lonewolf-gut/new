import { Icon } from '@iconify/react'

function LoaderIcon({ className }: { className?: string }) {
    return (
        <Icon icon="ri:loader-5-fill" className={`animate-spin text-white ${className}`} />
    )
}

export default LoaderIcon;