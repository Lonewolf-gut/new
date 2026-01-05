import type React from "react"
import { useState, useRef } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from "@/stores/userStore"
import { format } from "date-fns"
import { Icon } from "@iconify/react"
import ChangePasswordDialog from "@/shared/components/auth/ChangePasswordDialog"
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload"
import { api } from "@/lib/api"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"

type DialogType = "basic" | "account" | "password" | null

export default function PatientProfile() {
    const [openDialog, setOpenDialog] = useState<DialogType>(null)
    const profile = useUserStore((state) => state.user)?.profile
    const [profilePicture, setProfilePicture] = useState<string | null>(profile?.profilePicture || null)
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        phone: profile?.phoneNumber,
        gender: profile?.gender,
        niaCard: profile?.identificationNumber,
        dateOfBirth: format(new Date(profile?.dateOfBirth || ""), "yyyy-MM-dd"),

        email: useUserStore.getState().user?.email,
        role: profile?.role,
        accountStatus: profile?.approvalStatus,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value })
    }

    const handleProfilePictureClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file")
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB")
                return
            }

            setProfilePictureFile(file)

            const reader = new FileReader()
            reader.onloadend = () => {
                setProfilePicture(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }
    const { uploadFile } = useCloudinaryUpload();
    const handleSubmit = async () => {
        setIsSubmitting(true)

        try {
            const submitData = new FormData()

            // Append form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    submitData.append(key, value.toString())
                }
            })

            if (profilePictureFile) {
                const imageUrl = await uploadFile(profilePictureFile);
                if (imageUrl.success) {
                    submitData.append("profilePicture", imageUrl.url!)
                } else {
                    throw new Error("Failed to upload profile picture");
                }
            }
            await api.profiles.updateProfile(submitData);
            await useUserStore.getState().fetchUser();
            showSuccessToast("Profile updated successfully!")
            setOpenDialog(null)
        } catch (error) {
            showErrorToast((error as Error).message || "Failed to update profile. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full mx-auto p-6">
            {/* Verification Status Section */}
            <div className="border-l-4 border-primary pl-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Verification Status</h1>
                    <p className="text-muted-foreground">View verification requirements</p>
                </div>

                <div className="space-y-4">
                    {/* Basic Information */}
                    <div className="flex items-center justify-between p-6 border rounded-xl bg-card">
                        <div className="flex items-center gap-4">
                            <Icon icon="lucide:contact" className="size-6" />
                            <span className="font-medium text-lg">Basic Information</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" onClick={() => setOpenDialog("basic")}>
                                Edit
                            </Button>
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-none">
                                Complete
                            </Badge>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="flex items-center justify-between p-6 border rounded-xl bg-card">
                        <div className="flex items-center gap-4">
                            <Icon icon="teenyicons:tick-circle-outline" className="size-6" />
                            <span className="font-medium text-lg">Account Status</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" onClick={() => setOpenDialog("account")}>
                                View
                            </Button>
                            <Badge variant="outline" className="bg-green-100 border-none text-green-700">
                                Approved
                            </Badge>
                        </div>
                    </div>

                    {/* Password & Security */}
                    <div className="flex items-center justify-between p-6 border rounded-xl bg-card">
                        <div className="flex items-center gap-4">
                            <Icon icon="hugeicons:security" className="size-6" />
                            <span className="font-medium text-lg">Password & Security</span>
                        </div>
                        <Button size="sm" onClick={() => setOpenDialog("password")}>
                            Change Password
                        </Button>
                    </div>
                </div>
            </div>

            {/* Basic Information Dialog */}
            <Dialog open={openDialog === "basic"} onOpenChange={() => setOpenDialog(null)}>
                <DialogContent className="overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Basic Information</DialogTitle>
                        <DialogDescription>Update your personal details and professional information</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-3">
                            <Avatar className="size-24">
                                <AvatarImage src={profilePicture || ""} alt="Profile" className="object-cover" />
                                <AvatarFallback className="text-2xl bg-muted text-primary">
                                    {formData.firstName?.[0]}
                                    {formData.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            <Button variant="outline" size="sm" onClick={handleProfilePictureClick} type="button">
                                {profilePicture ? "Change Picture" : "Upload Picture"}
                            </Button>
                            {profilePicture && <p className="text-xs text-muted-foreground">{profilePictureFile?.name}</p>}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="bg-muted"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="bg-muted"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="bg-muted"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={formData.gender} disabled onValueChange={(value) => handleSelectChange("gender", value)}>
                                    <SelectTrigger className="bg-muted">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="niaCard">National Identification Card Number (NIA Card)</Label>
                            <Input
                                id="niaCard"
                                name="niaCard"
                                value={formData.niaCard}
                                onChange={handleInputChange}
                                className="bg-muted"
                                readOnly={!profile?.identificationNumber}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of birth</Label>
                            <div className="relative">
                                <Input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="bg-muted pr-10"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <Button
                            className="w-full bg-primary hover:bg-primary/90 h-12"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            Update {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Account Status Dialog */}
            <Dialog open={openDialog === "account"} onOpenChange={() => setOpenDialog(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Account Status</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={formData.email} readOnly className="bg-muted" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" name="role" value={formData.role} readOnly className="bg-muted" />
                        </div>

                        <div className="space-y-2">
                            <Label>Account Status</Label>
                            <div>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {formData.accountStatus}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <ChangePasswordDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
        </div>
    )
}
