"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { User, Activity, Pill, FileText, Plus, X, Save, CalendarIcon, Heart, Thermometer, Weight } from "lucide-react"
import type { DoctorPatientProfileResponse, Prescription, LegacyNotes } from "@/types/interfaces"
import { api } from "@/lib/api"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { formatDate } from "@/lib/utils"

interface PatientDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    patientId: string
}

export default function PatientDetailsDialog({ open, onOpenChange, patientId }: PatientDetailsDialogProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [patient, setPatient] = useState<DoctorPatientProfileResponse | null>(null)

    // Prescription filters
    const [searchMedication, setSearchMedication] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo] = useState("")

    // Form states
    const [newAllergy, setNewAllergy] = useState("")
    const [newCondition, setNewCondition] = useState("")
    const [newNote, setNewNote] = useState("")
    const [newSymptom, setNewSymptom] = useState("")

    const [newVitals, setNewVitals] = useState({
        heartRate: "",
        temperature: "",
        bloodPressure: "",
        bloodSugar: "",
        weight: "",
        symptoms: "",
    })

    const [newPrescription, setNewPrescription] = useState({
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        notes: "",
    })

    const [localAllergies, setLocalAllergies] = useState<string[]>([])
    const [localConditions, setLocalConditions] = useState<string[]>([])
    const [localSymptoms, setLocalSymptoms] = useState<Array<{ id: string; title: string; timestamp: string }>>([])
    const [localNotes, setLocalNotes] = useState<Partial<LegacyNotes>[]>([])
    const [prescriptions, setPrescriptions] = useState<Prescription[] | null>(null)

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const isNewItem = (id: string) => /^\d+$/.test(id)

    const fetchPatientProfile = async () => {
        if (!patientId) return
        setIsLoading(true)
        setError(null)
        try {
            const res = await api.patients.getDoctorProfile(patientId)
            const data = res.data as DoctorPatientProfileResponse
            setPatient(data)
            setLocalAllergies(data.medicalConditions?.allergies || [])
            setLocalConditions(data.medicalConditions?.chronicConditions || [])
            setLocalSymptoms(data.currentSymptoms || [])
            setLocalNotes(data.legacyNotes || [])
            setPrescriptions(data.prescriptions || [])
        } catch (err: any) {
            const msg = err?.message || "Failed to load patient profile"
            setError(msg)
            showErrorToast(msg)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (open && patientId) {
            fetchPatientProfile()
        }
    }, [open, patientId, dateFrom, dateTo, searchMedication])

    // Handlers for adding/removing health records
    const addAllergy = () => {
        if (newAllergy.trim()) {
            setLocalAllergies([...localAllergies, newAllergy.trim()])
            setNewAllergy("")
        }
    }

    const removeAllergy = (index: number) => {
        setLocalAllergies(localAllergies.filter((_, i) => i !== index))
    }

    const addCondition = () => {
        if (newCondition.trim()) {
            setLocalConditions([...localConditions, newCondition.trim()])
            setNewCondition("")
        }
    }

    const removeCondition = (index: number) => {
        setLocalConditions(localConditions.filter((_, i) => i !== index))
    }

    const addSymptom = () => {
        if (newSymptom.trim()) {
            setLocalSymptoms([
                ...localSymptoms,
                {
                    id: Date.now().toString(),
                    title: newSymptom,
                    timestamp: new Date().toLocaleString(),
                },
            ])
            setNewSymptom("")
        }
    }

    const removeSymptom = (id: string) => {
        setLocalSymptoms(localSymptoms.filter((s) => s.id !== id))
    }

    const handleSavePrescription = async () => {
        if (!patientId) return
        setIsSaving(true)
        try {
            await api.prescriptions.create(newPrescription)
            showSuccessToast("Prescription added successfully")
            setNewPrescription({
                medication: "",
                dosage: "",
                frequency: "",
                duration: "",
                notes: "",
            })
            await fetchPatientProfile()
        } catch (error: any) {
            showErrorToast(error?.message || "Failed to add prescription")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveNote = async () => {
        if (!patientId || !newNote.trim()) return
        setIsSaving(true)
        try {
            await api.patients.createLegacyNote(patientId, { notes: newNote })
            showSuccessToast("Note saved successfully")
            setNewNote("")
            await fetchPatientProfile()
        } catch (error: any) {
            showErrorToast(error?.message || "Failed to save note")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveMedicalRecords = async () => {
        if (!patientId) return
        setIsSaving(true)
        try {
            await api.patients.updateMedicalConditions(patientId, {
                chronicConditions: localConditions,
                allergies: localAllergies,
            })

            for (const symptom of localSymptoms.filter((s) => isNewItem(s.id))) {
                await api.vitals.addVitals(patientId, { symptoms: symptom.title })
            }

            showSuccessToast("Medical records updated successfully")
            await fetchPatientProfile()
        } catch (error: any) {
            showErrorToast(error?.message || "Failed to save medical records")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveVitals = async () => {
        if (!patientId) return
        setIsSaving(true)
        try {
            await api.vitals.addVitals(patientId, {
                heartRate: newVitals.heartRate ? Number.parseInt(newVitals.heartRate) : undefined,
                temperature: newVitals.temperature ? Number.parseFloat(newVitals.temperature) : undefined,
                bloodPressure: newVitals.bloodPressure || undefined,
                bloodSugar: newVitals.bloodSugar ? Number.parseInt(newVitals.bloodSugar) : undefined,
                weight: newVitals.weight ? Number.parseFloat(newVitals.weight) : undefined,
                symptoms: newVitals.symptoms || undefined,
            })
            showSuccessToast("Vitals recorded successfully")
            setNewVitals({
                heartRate: "",
                temperature: "",
                bloodPressure: "",
                bloodSugar: "",
                weight: "",
                symptoms: "",
            })
            await fetchPatientProfile()
        } catch (error: any) {
            showErrorToast(error?.message || "Failed to save vitals")
        } finally {
            setIsSaving(false)
        }
    }

    const filteredPrescriptions = prescriptions?.filter((rx) => {
        const matchesSearch = !searchMedication || rx.medication.toLowerCase().includes(searchMedication.toLowerCase())
        const matchesDateFrom = !dateFrom || new Date(rx.createdAt) >= new Date(dateFrom)
        const matchesDateTo = !dateTo || new Date(rx.createdAt) <= new Date(dateTo)
        return matchesSearch && matchesDateFrom && matchesDateTo
    })

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl max-h-[90vh]">
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="h-10 w-10" />
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    if (error && !patient) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl">
                    <div className="text-center py-12">
                        <p className="text-destructive mb-6">{error}</p>
                        <Button onClick={fetchPatientProfile}>
                            Retry
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    if (!patient) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 px-6 py-5 border-b bg-background shrink-0 z-10">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            <Avatar className="h-20 w-20 shrink-0 ring-2 ring-primary/10">
                                <AvatarImage src={patient.profile.profilePicture || "/placeholder.svg"} />
                                <AvatarFallback className="text-lg bg-primary/10 font-semibold">
                                    {patient.profile.firstName[0]}
                                    {patient.profile.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 space-y-1">
                                <h2 className="text-xl font-bold truncate">
                                    {patient.profile.firstName} {patient.profile.lastName}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {calculateAge(patient.profile.dateOfBirth.toString())} years old • {patient.profile.gender}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">{patient.profile.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <div className="text-center px-4 py-3 bg-red-50 rounded-lg border border-red-100">
                                <div className="text-2xl font-bold text-red-600">{localAllergies.length}</div>
                                <div className="text-xs text-red-600/70 font-medium mt-1">Allergies</div>
                            </div>
                            <div className="text-center px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="text-2xl font-bold text-blue-600">{localConditions.length}</div>
                                <div className="text-xs text-blue-600/70 font-medium mt-1">Conditions</div>
                            </div>
                            <div className="text-center px-4 py-3 bg-green-50 rounded-lg border border-green-100">
                                <div className="text-2xl font-bold text-green-600">
                                    {prescriptions?.filter((p) => new Date(p.endDate) > new Date()).length || 0}
                                </div>
                                <div className="text-xs text-green-600/70 font-medium mt-1">Active Rx</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {/* Overview */}
                        <AccordionItem value="overview" className="border rounded-lg px-4">
                            <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <span>Patient Overview</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-2 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date of Birth</p>
                                        <p className="text-sm font-medium">{formatDate(new Date(patient.profile.dateOfBirth))}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gender</p>
                                        <p className="text-sm font-medium">{patient.profile.gender}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                                        <p className="text-sm font-medium truncate">{patient.profile.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</p>
                                        <p className="text-sm font-medium">{patient.profile.phoneNumber}</p>
                                    </div>
                                </div>

                                {patient.vitals && patient.vitals.length > 0 && (
                                    <div className="border-t pt-4 mt-4">
                                        <p className="text-sm font-semibold mb-3">Latest Vitals</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(() => {
                                                const latest = patient.vitals[0]
                                                return (
                                                    <>
                                                        {latest.heartRate && (
                                                            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                                                                <Heart className="w-5 h-5 text-red-500" />
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                                                                    <p className="text-sm font-semibold">{latest.heartRate} bpm</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {latest.temperature && (
                                                            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                                                <Thermometer className="w-5 h-5 text-orange-500" />
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Temperature</p>
                                                                    <p className="text-sm font-semibold">{latest.temperature}°C</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {latest.bloodPressure && (
                                                            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                                <Activity className="w-5 h-5 text-blue-500" />
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Blood Pressure</p>
                                                                    <p className="text-sm font-semibold">{latest.bloodPressure}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {latest.weight && (
                                                            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                                                                <Weight className="w-5 h-5 text-green-500" />
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Weight</p>
                                                                    <p className="text-sm font-semibold">{latest.weight} kg</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        {/* Health Records */}
                        <AccordionItem value="health" className="border rounded-lg px-4">
                            <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Activity className="w-5 h-5 text-primary" />
                                    </div>
                                    <span>Health Records</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-2 space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Allergies</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add new allergy..."
                                            value={newAllergy}
                                            onChange={(e) => setNewAllergy(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                                            className="h-9"
                                        />
                                        <Button size="sm" onClick={addAllergy} className="h-9 px-3">
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {localAllergies.map((allergy, idx) => (
                                            <Badge key={idx} variant="destructive" className="text-sm gap-2 py-1.5 px-3">
                                                {allergy}
                                                <X className="h-3.5 w-3.5 cursor-pointer" onClick={() => removeAllergy(idx)} />
                                            </Badge>
                                        ))}
                                        {localAllergies.length === 0 && <p className="text-sm text-muted-foreground py-2">No allergies recorded</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Chronic Conditions</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add new condition..."
                                            value={newCondition}
                                            onChange={(e) => setNewCondition(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && addCondition()}
                                            className="h-9"
                                        />
                                        <Button size="sm" onClick={addCondition} className="h-9 px-3">
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {localConditions.map((condition, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-sm gap-2 py-1.5 px-3">
                                                {condition}
                                                <X className="h-3.5 w-3.5 cursor-pointer" onClick={() => removeCondition(idx)} />
                                            </Badge>
                                        ))}
                                        {localConditions.length === 0 && <p className="text-sm text-muted-foreground py-2">No conditions recorded</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Current Symptoms</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add new symptom..."
                                            value={newSymptom}
                                            onChange={(e) => setNewSymptom(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && addSymptom()}
                                            className="h-9"
                                        />
                                        <Button size="sm" onClick={addSymptom} className="h-9 px-3">
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add
                                        </Button>
                                    </div>
                                    <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
                                        {localSymptoms.map((symptom) => (
                                            <div key={symptom.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                                <p className="text-sm">{symptom.title}</p>
                                                <X className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground flex-shrink-0 ml-2" onClick={() => removeSymptom(symptom.id)} />
                                            </div>
                                        ))}
                                        {localSymptoms.length === 0 && <p className="text-sm text-muted-foreground py-2">No symptoms recorded</p>}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSaveMedicalRecords}
                                    disabled={isSaving}
                                    className="w-full h-10"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {isSaving ? "Saving..." : "Save Medical Records"}
                                </Button>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Vitals */}
                        <AccordionItem value="vitals" className="border rounded-lg px-4">
                            <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Heart className="w-5 h-5 text-primary" />
                                    </div>
                                    <span>Record Vitals</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-2 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Heart Rate (bpm)</Label>
                                        <Input
                                            type="number"
                                            placeholder="72"
                                            className="h-10"
                                            value={newVitals.heartRate}
                                            onChange={(e) => setNewVitals({ ...newVitals, heartRate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Temperature (°C)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="36.5"
                                            className="h-10"
                                            value={newVitals.temperature}
                                            onChange={(e) => setNewVitals({ ...newVitals, temperature: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Blood Pressure</Label>
                                        <Input
                                            placeholder="120/80"
                                            className="h-10"
                                            value={newVitals.bloodPressure}
                                            onChange={(e) => setNewVitals({ ...newVitals, bloodPressure: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Blood Sugar (mg/dL)</Label>
                                        <Input
                                            type="number"
                                            placeholder="95"
                                            className="h-10"
                                            value={newVitals.bloodSugar}
                                            onChange={(e) => setNewVitals({ ...newVitals, bloodSugar: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-sm font-medium">Weight (kg)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="70.5"
                                            className="h-10"
                                            value={newVitals.weight}
                                            onChange={(e) => setNewVitals({ ...newVitals, weight: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleSaveVitals} disabled={isSaving} className="w-full h-10">
                                    <Save className="w-4 h-4 mr-2" />
                                    {isSaving ? "Recording..." : "Record Vitals"}
                                </Button>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Prescriptions */}
                        <AccordionItem value="prescriptions" className="border rounded-lg px-4">
                            <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Pill className="w-5 h-5 text-primary" />
                                    </div>
                                    <span>Prescriptions</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-2 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Search medications..."
                                        value={searchMedication}
                                        onChange={(e) => setSearchMedication(e.target.value)}
                                        className="h-10 flex-1"
                                    />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-10 px-3">
                                                <CalendarIcon className="w-4 h-4 mr-2" />
                                                Filter
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dateFrom ? new Date(dateFrom) : undefined}
                                                onSelect={(d) => setDateFrom(d ? d.toISOString().slice(0, 10) : "")}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {filteredPrescriptions && filteredPrescriptions.length > 0 && (
                                    <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                                        {filteredPrescriptions.slice(0, 10).map((rx) => {
                                            const isActive = new Date(rx.endDate) > new Date()
                                            return (
                                                <div key={rx.id} className="p-3 border rounded-lg bg-card">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="flex-1 min-w-0 space-y-1">
                                                            <p className="font-semibold text-sm">{rx.medication}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {rx.dosage} • {rx.frequency}
                                                            </p>
                                                        </div>
                                                        <Badge variant={isActive ? "default" : "outline"} className="shrink-0">
                                                            {isActive ? "Active" : "Completed"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                                {filteredPrescriptions && filteredPrescriptions.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-6">No prescriptions found</p>
                                )}

                                <div className="border-t pt-4 space-y-3">
                                    <p className="text-sm font-semibold">Add New Prescription</p>
                                    <Input
                                        placeholder="Medication name"
                                        className="h-10"
                                        value={newPrescription.medication}
                                        onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            placeholder="Dosage (e.g., 500mg)"
                                            className="h-10"
                                            value={newPrescription.dosage}
                                            onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Frequency (e.g., 2x daily)"
                                            className="h-10"
                                            value={newPrescription.frequency}
                                            onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                                        />
                                    </div>
                                    <Button onClick={handleSavePrescription} disabled={isSaving} className="w-full h-10">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Prescription
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Notes */}
                        <AccordionItem value="notes" className="border rounded-lg px-4">
                            <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <span>Clinical Notes</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-2 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Add New Note</Label>
                                    <Textarea
                                        placeholder="Enter clinical notes..."
                                        rows={4}
                                        className="resize-none"
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                    />
                                </div>
                                <Button
                                    onClick={handleSaveNote}
                                    disabled={isSaving || !newNote.trim()}
                                    className="w-full h-10"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Note
                                </Button>

                                {localNotes && localNotes.length > 0 && (
                                    <div className="space-y-2 max-h-48 overflow-y-auto border-t pt-4">
                                        <p className="text-sm font-semibold mb-3">Previous Notes</p>
                                        {localNotes.slice(0, 5).map((note) => (
                                            <div key={note.id} className="p-3 bg-muted rounded-lg space-y-1">
                                                <p className="text-xs text-muted-foreground">
                                                    {note.createdAt && new Date(note.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-sm leading-relaxed">{note.notes}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </DialogContent>
        </Dialog>
    )
}