import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { LoadingSpinner } from '../LoadingSpinner'

const schema = z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

type ChangePasswordProps = {
    openDialog: string | null
    setOpenDialog: (value: "basic" | "account" | "password" | null) => void
}

function ChangePasswordDialog({ openDialog, setOpenDialog }: ChangePasswordProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    })
    const [isLoading, setIsLoading] = React.useState(false)

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true)
            await api.auth.changePassword({
                currentPassword: data.oldPassword,
                newPassword: data.newPassword,
            })
            reset()
            setOpenDialog(null)
            showSuccessToast('Password changed successfully', "You've successfully changed your password.")
        } catch (error) {
            showErrorToast((error as Error).message ?? 'Failed to change password', "Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={openDialog === 'password'} onOpenChange={() => setOpenDialog(null)}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Change Password</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <Label htmlFor="oldPassword">Old Password</Label>
                        <Input
                            id="oldPassword"
                            type="password"
                            placeholder="Enter Old Password"
                            {...register('oldPassword')}
                        />
                        {errors.oldPassword && (
                            <span className="text-red-500 text-sm">{errors.oldPassword.message}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter New Password"
                            {...register('newPassword')}
                        />
                        {errors.newPassword && (
                            <span className="text-red-500 text-sm">{errors.newPassword.message}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm New Password"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                        )}
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 h-12" type="submit" disabled={isLoading}>
                        Change Password {isLoading && <LoadingSpinner size='sm' className='ml-3' />}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePasswordDialog