import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FileText, Upload, Eye, Trash2, Download, Plus, Activity } from "lucide-react"
import { Icon } from "@iconify/react"
import { useMedicalRecordStore } from "@/stores/medicalRecordStore"
import type { MedicalFile, Vital } from "@/types/interfaces"
import { api } from "@/lib/api"
import { useUserStore } from "@/stores/userStore"
import { showErrorToast, showInfoToast, showSuccessToast } from "@/lib/toast"
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload"
import PatientPrescriptions from "./PatientPrescriptions"

const medicalFileSchema = z.object({
    fileType: z.string().min(1, "Please select a file type"),
    title: z.string().min(1, "Title is required"),
    notes: z.string().optional(),
})

type MedicalFileFormData = z.infer<typeof medicalFileSchema>

const vitalsSchema = z.object({
    heartRate: z.string().optional(),
    temperature: z.string().optional(),
    bloodSugar: z.string().optional(),
    bloodPressure: z.string().optional(),
    weight: z.string().optional(),
    symptoms: z.string().optional(),

})

type VitalsFormData = z.infer<typeof vitalsSchema>

export function PatientHealthRecords() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const { medicalFiles, vitals, addVital, addMedicalFile } = useMedicalRecordStore((state) => state)
    const [isLoading] = useState(false)
    const medicalFileForm = useForm<MedicalFileFormData>({
        resolver: zodResolver(medicalFileSchema),
        defaultValues: {
            fileType: "",
            title: "",
            notes: "",
        },
    })

    const vitalsForm = useForm<VitalsFormData>({
        resolver: zodResolver(vitalsSchema),
    })

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            if (!medicalFileForm.getValues("title")) {
                medicalFileForm.setValue("title", file.name)
            }
        }
    }
    const { uploadFile } = useCloudinaryUpload()

    const onSubmitMedicalFile = async (data: MedicalFileFormData) => {
        if (!selectedFile) {
            showErrorToast("Missing Information", "Please select a file")
            return
        }

        setIsUploading(true)

        try {
            const fileUrl = await uploadFile(selectedFile)
            if (!fileUrl.success) {
                throw new Error("File upload failed")
            }
            const newRecord: Partial<MedicalFile> = {
                title: data.title,
                fileType: data.fileType,
                url: fileUrl.url!,
                notes: data.notes || "",
            }
            await api.patients.addMedicalFile(useUserStore.getState().user?.id!, newRecord)
            addMedicalFile(newRecord)
            showSuccessToast("Success", "Medical record uploaded successfully")

            medicalFileForm.reset()
            setSelectedFile(null)
            setIsDialogOpen(false)
        } catch (_error) {
            showErrorToast("Upload Failed", "Failed to upload medical record. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    const onSubmitVitals = async (data: VitalsFormData) => {
        try {
            const allEmpty =
                !data.heartRate &&
                !data.temperature &&
                !data.bloodSugar &&
                !data.bloodPressure &&
                !data.weight &&
                !data.symptoms;

            if (allEmpty) {
                showErrorToast("Missing Information", "Please enter at least one vital sign or symptom.");
                return
            }

            const newVitalRecord: Partial<Vital> = {
                id: Date.now().toString(),
                heartRate: Number(data.heartRate),
                temperature: Number(data.temperature),
                bloodSugar: Number(data.bloodSugar),
                bloodPressure: data.bloodPressure || "-",
                weight: Number(data.weight),

                symptoms: data.symptoms,
            }
            await api.vitals.addVitals(useUserStore.getState().user?.id!, newVitalRecord)

            addVital(newVitalRecord)

            showSuccessToast("Success", "Vital signs recorded successfully")

            vitalsForm.reset();
        } catch (_error) {
            showErrorToast("Error", "Failed to record vital signs. Please try again.")
        }
    }

    const handleDelete = (id: string) => {
        console.log("Deleting record with id:", id)
        showErrorToast("Deleted", "Medical record deleted successfully")
    }

    const handleView = (record: MedicalFile) => {
        window.open(record.url, "_blank")
    }

    const handleDownload = (record: MedicalFile) => {
        const link = document.createElement("a");
        link.href = record.url;
        link.download = record.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showInfoToast("Downloading", `Downloading ${record.title}...`)
    }

    return (
        <Tabs defaultValue="medical-records" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/30 rounded-xl mb-6">
                <TabsTrigger
                    value="medical-records"
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-3"
                >
                    <Icon icon="mi:document" className="h-4 w-4" />
                    Medical Records
                </TabsTrigger>
                <TabsTrigger
                    value="prescriptions"
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-3"
                >
                    <Icon icon="mdi:drugs" className="h-4 w-4" />
                    Prescriptions
                </TabsTrigger>
                <TabsTrigger
                    value="vitals-history"
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-3"
                >
                    <Icon icon="material-symbols:vitals-rounded" className="h-4 w-4" />
                    Vitals Signs
                </TabsTrigger>
            </TabsList>

            {/* Medical Records Tab */}
            <TabsContent value="medical-records" className="space-y-6 p-6 border-l-3 border-l-primary bg-[#F9F9F9]">
                {/* Header with Upload Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Medical Files</h2>
                        <p className="text-muted-foreground">Your uploaded medical files</p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Medical Record
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Upload Medical Files</DialogTitle>
                                <DialogDescription>
                                    Upload lab reports, imaging, prescriptions, and other medical documents
                                </DialogDescription>
                            </DialogHeader>

                            <Form {...medicalFileForm}>
                                <form onSubmit={medicalFileForm.handleSubmit(onSubmitMedicalFile)} className="space-y-6 mt-4">
                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Select File</label>
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        id="file-upload"
                                                        className="hidden"
                                                        onChange={handleFileSelect}
                                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                    />
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted rounded-xl bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors"
                                                    >
                                                        <Upload className="h-8 w-8 text-primary mb-2" />
                                                        <span className="text-sm font-medium text-primary">
                                                            {selectedFile ? selectedFile.name : "Upload File"}
                                                        </span>
                                                    </label>
                                                    {!selectedFile && <p className="text-sm text-destructive mt-1">File is required</p>}
                                                </div>
                                            </div>

                                            <FormField
                                                control={medicalFileForm.control}
                                                name="fileType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>File Type</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 rounded-xl">
                                                                    <SelectValue placeholder="Select File Type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Lab Report">Lab Report</SelectItem>
                                                                <SelectItem value="Imaging">Imaging</SelectItem>
                                                                <SelectItem value="Prescription">Prescription</SelectItem>
                                                                <SelectItem value="Vaccination Record">Vaccination Record</SelectItem>
                                                                <SelectItem value="Medical History">Medical History</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={medicalFileForm.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Title</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter a title for this file..."
                                                                className="h-12 rounded-xl"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Right Column */}
                                        <FormField
                                            control={medicalFileForm.control}
                                            name="notes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Notes (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Add any notes about this file..."
                                                            className="h-[200px] rounded-xl resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button type="submit" disabled={isUploading || !selectedFile} className="w-full">
                                        {isUploading ? "Uploading..." : "Upload File"}
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Medical Records List */}
                {medicalFiles?.length > 0 ? (
                    <div className="space-y-3">
                        {medicalFiles.map((record) => (
                            <div
                                key={record.id}
                                className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{record.title}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                                {record.fileType}
                                            </Badge>
                                            <span>•</span>
                                            <span>{record.createdAt}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleView(record)}
                                        className="h-10 w-10 rounded-lg hover:bg-primary/10"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(record.id)}
                                        className="h-10 w-10 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDownload(record)}
                                        className="h-10 w-10 rounded-lg hover:bg-primary/10"
                                    >
                                        <Download className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <FileText className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Health Records Yet</h3>
                        <p className="text-muted-foreground max-w-md">
                            Your health records will appear here once your doctor adds them to your profile.
                        </p>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="prescriptions" className="p-6 bg-[#F9F9F9] border-l-3 border-l-primary">
                <PatientPrescriptions />
            </TabsContent>

            <TabsContent value="vitals-history" className="p-6 bg-[#F9F9F9]">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Upload Medical Files</h2>
                        <p className="text-muted-foreground">
                            Track your health by recording your vital signs. Fill in any measurements you have.
                        </p>
                    </div>

                    <Form {...vitalsForm}>
                        <form onSubmit={vitalsForm.handleSubmit(onSubmitVitals)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <FormField
                                        control={vitalsForm.control}
                                        name="heartRate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-base">
                                                    <Icon icon="mdi:heart-outline" className="h-5 w-5 text-red-500" />
                                                    Heart Rate (BPM)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 72 (normal: 60-100 bpm)" className="h-14 rounded-xl"  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={vitalsForm.control}
                                        name="temperature"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-base">
                                                    <Icon icon="carbon:temperature-min" className="h-5 w-5 text-red-500" />
                                                    Temperature (°C)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. 36.5 (normal body temperature)"
                                                        className="h-14 rounded-xl"
                                                        type="number"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={vitalsForm.control}
                                        name="bloodSugar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-base">
                                                    <Icon
                                                        icon="streamline-pixel:health-laboratory-test-blood-sugar"
                                                        className="h-5 w-5 text-purple-500"
                                                    />
                                                    Blood Sugar (mg/dL)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 95 (fasting: 70-100 mg/dL)" className="h-14 rounded-xl" {...field} />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Normal fasting: 70-100 mg/dL. After meals: less than 140 mg/dL
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={vitalsForm.control}
                                        name="bloodPressure"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-base">
                                                    <Icon icon="healthicons:blood-pressure-monitor-outline" className="h-5 w-5 text-blue-500" />
                                                    Blood Pressure (mmHg)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. 120 (top number) / 80 (bottom number)"
                                                        className="h-14 rounded-xl"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <FormField
                                        control={vitalsForm.control}
                                        name="weight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-base">
                                                    <Icon icon="material-symbols:balance" className="h-5 w-5 text-green-500" />
                                                    Weight (kg)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 70.5 (in kilograms)" className="h-14 rounded-xl"  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={vitalsForm.control}
                                        name="symptoms"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">Symptoms or Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="e.g. Feeling tired, headache, chest pain, difficulty breathing, etc"
                                                        className="h-[280px] rounded-xl resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Describe any symptoms, how you're feeling, or additional health notes
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Recording..." : "Record Vitals"}
                            </Button>
                        </form>
                    </Form>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Vitals History</h2>
                            <p className="text-muted-foreground">Your recorded vital signs will appear here</p>
                        </div>

                        {vitals?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <div className="min-w-full">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-5 gap-4 pb-4 border-b border-border">
                                        <div className="text-sm font-medium text-muted-foreground">Heart Rate (bpm)</div>
                                        <div className="text-sm font-medium text-muted-foreground">Temperature (°C)</div>
                                        <div className="text-sm font-medium text-muted-foreground">Blood Sugar (mg/dL)</div>
                                        <div className="text-sm font-medium text-muted-foreground">Blood Pressure (mmHg)</div>
                                        <div className="text-sm font-medium text-muted-foreground">Weight (kg)</div>
                                    </div>

                                    {/* Table Rows */}
                                    <div className="space-y-4 mt-4">
                                        {vitals.map((record) => (
                                            <div key={record.id} className="grid grid-cols-5 gap-4 py-4 border-b border-border/50">
                                                <div className="text-foreground">{record.heartRate}</div>
                                                <div className="text-foreground">{record.temperature}</div>
                                                <div className="text-foreground">{record.bloodSugar}</div>
                                                <div className="text-foreground">{record.bloodPressure}</div>
                                                <div className="text-foreground">{record.weight}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <Activity className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">No Vitals Recorded Yet</h3>
                                <p className="text-muted-foreground max-w-md">
                                    Start recording your vital signs to track your health over time.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    )
}

export default PatientHealthRecords
