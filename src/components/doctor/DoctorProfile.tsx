"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Icon } from "@iconify/react"
import ChangePasswordDialog from "@/shared/components/auth/ChangePasswordDialog"
import { useUserStore } from '@/stores/userStore'
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload'
import { api } from '@/lib/api'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"

type DialogType = "basic" | "account" | "documents" | "password" | null

export default function DoctorProfile() {
    const [openDialog, setOpenDialog] = useState<DialogType>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [profilePicture, setProfilePicture] = useState<string | null>(null)
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { uploadFile } = useCloudinaryUpload()

    const profile = useUserStore((state) => state.user?.profile)

    const [formData, setFormData] = useState({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        phone: profile?.phoneNumber || "",
        gender: profile?.gender || undefined,
        specialty: profile?.specialty || "",
        licenseNumber: profile?.licenseNumber || "",
        bio: profile?.bio || "",
        hospitalAffiliation: profile?.hospital?.name || "",
        email: useUserStore.getState().user?.email || "",
        role: profile?.role || "",
        isApproved: profile?.isApproved || "",
    })

    useEffect(() => {
        setFormData({
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            phone: profile?.phoneNumber || "",
            gender: profile?.gender || undefined,
            specialty: profile?.specialty || "",
            licenseNumber: profile?.licenseNumber || "",
            bio: profile?.bio || "",
            hospitalAffiliation: profile?.hospital?.name || "",
            email: useUserStore.getState().user?.email || "",
            role: profile?.role || "",
            isApproved: profile?.isApproved || "",
        })
        setProfilePicture(profile?.profilePicture || null)
    }, [profile])

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
            if (!file.type.startsWith("image/")) {
                showErrorToast("Please select an image file")
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                showErrorToast("File size must be less than 5MB")
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

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const submitData = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== "") {
                    submitData.append(key, String(value))
                }
            })

            if (profilePictureFile) {
                const imageUrl = await uploadFile(profilePictureFile)
                if (!imageUrl?.success) {
                    throw new Error('Image upload failed')
                }
                submitData.append('profilePicture', imageUrl.url!)
            }

            await api.profiles.updateProfile(submitData)
            await useUserStore.getState().fetchUser()
            showSuccessToast('Profile updated successfully!')
            setOpenDialog(null)
        } catch (err: any) {
            showErrorToast(err?.message || 'Failed to update profile')
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
                            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="font-medium text-lg">Basic Information</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" onClick={() => setOpenDialog("basic")}>
                                Edit
                            </Button>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="flex items-center justify-between p-6 border rounded-xl bg-card">
                        <div className="flex items-center gap-4">
                            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="font-medium text-lg">Account Status</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" onClick={() => setOpenDialog("account")}>
                                View
                            </Button>
                        </div>
                    </div>

                    {/* Verification Documents */}
                    <div className="flex items-center justify-between p-6 border rounded-xl bg-card">
                        <div className="flex items-center gap-4">
                            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span className="font-medium text-lg">Verification Documents</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" onClick={() => setOpenDialog("documents")}>
                                Upload
                            </Button>
                        </div>
                    </div>

                    {/* Password & Security */}
                    <div className="flex items-center justify-between p-6 border rounded-xl bg-card">
                        <div className="flex items-center gap-4">
                            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <span className="font-medium text-lg">Password & Security</span>
                        </div>
                        <Button size="sm" onClick={() => setOpenDialog("password")}>Change Password</Button>
                    </div>
                </div>
            </div>

            {/* Basic Information Dialog */}
            <Dialog open={openDialog === "basic"} onOpenChange={() => setOpenDialog(null)}>
                <DialogContent>
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
                            {profilePictureFile && <p className="text-xs text-muted-foreground">{profilePictureFile.name}</p>}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="bg-muted" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="bg-muted" readOnly />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="bg-muted" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                                    <SelectTrigger className="bg-muted">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="specialty">Specialty</Label>
                                <Input id="specialty" name="specialty" value={formData.specialty} onChange={handleInputChange} className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="licenseNumber">Medical License Number</Label>
                                <Input id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} className="bg-muted" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hospitalAffiliation">Hospital Affiliation</Label>
                                <Input id="hospitalAffiliation" name="hospitalAffiliation" value={formData.hospitalAffiliation} className="bg-muted" readOnly />
                            </div>
                            <div />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Professional Bio</Label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about your professional background"
                                className="w-full px-3 py-2 border rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                rows={4}
                            />
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90 h-12" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <div className="flex items-center justify-center w-full">
                                    <LoadingSpinner />
                                    <span className="ml-2">Updating...</span>
                                </div>
                            ) : (
                                'Update'
                            )}
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
                                <Badge variant="outline" className={`${formData.isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} border-none`}>
                                    {formData.isApproved ? "Approved" : "Pending"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Verification Documents Dialog */}
            <Dialog open={openDialog === "documents"} onOpenChange={() => setOpenDialog(null)}>
                <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Verification Documents</DialogTitle>
                        <DialogDescription>Upload required documents for verification</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Document Upload Cards */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                {
                                    key: "medicalLicense",
                                    title: "Medical License",
                                    desc: "Upload your current medical license certificates",
                                },
                                {
                                    key: "specialtyCertificate",
                                    title: "Specialty Certificate",
                                    desc: "Upload your specialty certification (if applicable)",
                                },
                                {
                                    key: "governmentId",
                                    title: "Government ID",
                                    desc: "Upload a copy of your national ID or passport",
                                },
                            ].map((doc) => (
                                <Card key={doc.key} className="border-2 border-dashed p-4 text-center hover:border-primary transition-colors">
                                    <div className="mb-3 flex justify-center">
                                        <Badge className="bg-red-50 text-red-600 border-none">Required</Badge>
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">{doc.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-4">{doc.desc}</p>
                                    <Button variant="outline" size="sm" onClick={() => { }} className="gap-2 text-primary border-primary hover:bg-primary hover:text-white w-full">
                                        <Upload className="w-4 h-4" />
                                        Upload
                                    </Button>
                                </Card>
                            ))}
                        </div>

                        <p className="text-xs text-muted-foreground">Accepted formats: PDF, JPG, PNG (max 5MB)</p>

                        {/* Info Boxes */}
                        <div className="bg-primary/10 rounded-lg p-4 flex gap-3">
                            <Icon icon="material-symbols:info-outline-rounded" className="text-primary w-12 h-12" />
                            <div>
                                <h4 className="font-semibold text-primary mb-1">Document Verification Process</h4>
                                <p className="text-sm text-muted-foreground">
                                    All documents will be securely reviewed by our verification team. This process typically takes 1-3
                                    business days. You'll receive an email notification once your credentials are verified.
                                </p>
                            </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3">
                            <Icon icon="material-symbols:info-outline-rounded" className="text-primary w-12 h-12" />
                            <div>
                                <h4 className="font-semibold text-primary mb-1">Data Security & Privacy</h4>
                                <p className="text-sm text-muted-foreground">
                                    Your documents are encrypted and stored securely. We only use them for verification purposes and
                                    comply with all healthcare data protection regulations.
                                </p>
                            </div>
                        </div>
                        <Button className="w-full">Submit</Button>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Change Password Dialog */}
            <ChangePasswordDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
        </div>
    )
}

