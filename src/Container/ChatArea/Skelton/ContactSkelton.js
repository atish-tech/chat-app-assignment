import { Skeleton } from '@mui/material'
import React from 'react'

const ContactSkelton = () => {
    return (
        <div className='flex flex-col m-3'>
            <div className='flex gap-2'>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="rounded" width={300} height={60} />
            </div>
            <div className='flex gap-2 mt-4'>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="rounded" width={300} height={60} />
            </div>
            <div className='flex gap-2 mt-4'>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="rounded" width={300} height={60} />
            </div>
            <div className='flex gap-2 mt-4'>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="rounded" width={300} height={60} />
            </div>
            <div className='flex gap-2 mt-4'>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="rounded" width={300} height={60} />
            </div>
            <div className='flex gap-2 mt-4'>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="rounded" width={300} height={60} />
            </div>
            <div className='flex gap-2 mt-4'>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="rounded" width={300} height={60} />
            </div>
            
        </div>
    )
}

export default ContactSkelton