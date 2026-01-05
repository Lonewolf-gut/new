import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    X,
    MapPin,
    Plus,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useState, useEffect } from "react";
import type { DoctorPatient, Prescription, DoctorPatientProfileResponse, LegacyNotes } from "@/types/interfaces";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";

function DoctorPatientProfile({ handleBackToList, patient }: {
    handleBackToList: () => void;
    patient: DoctorPatient;
}) {
    const [activeTab, setActiveTab] = useState<"health" | "info">("health");
    const [prescriptions, setPrescriptions] = useState<Prescription[] | null>(null);
    const [chronicConditions, setChronicConditions] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [currentSymptoms, setCurrentSymptoms] = useState<Array<{ id: string; title: string; timestamp: string }>>([]);
    const [legacyNotes, setLegacyNotes] = useState<Partial<LegacyNotes>[]>([]);
    const [newCondition, setNewCondition] = useState("");
    const [newAllergy, setNewAllergy] = useState("");
    const [newSymptom, setNewSymptom] = useState("");
    const [newNote, setNewNote] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [searchMedication, setSearchMedication] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [, setProfileData] = useState<DoctorPatientProfileResponse | null>(null);

    const addChronicCondition = () => {
        if (newCondition.trim()) {
            setChronicConditions([...chronicConditions, newCondition]);
            setNewCondition("");
        }
    };

    const removeChronicCondition = (index: number) => {
        setChronicConditions(chronicConditions.filter((_, i) => i !== index));
    };

    const addAllergy = () => {
        if (newAllergy.trim()) {
            setAllergies([...allergies, newAllergy]);
            setNewAllergy("");
        }
    };

    const removeAllergy = (index: number) => {
        setAllergies(allergies.filter((_, i) => i !== index));
    };

    const addSymptom = () => {
        if (newSymptom.trim()) {
            setCurrentSymptoms([
                ...currentSymptoms,
                {
                    id: Date.now().toString(),
                    title: newSymptom,
                    timestamp: new Date().toLocaleString(),
                },
            ]);
            setNewSymptom("");
        }
    };

    const removeSymptom = (id: string) => {
        setCurrentSymptoms(currentSymptoms.filter((s) => s.id !== id));
    };

    const addNote = () => {
        if (newNote.trim()) {
            setLegacyNotes([
                ...legacyNotes,
                {
                    id: Date.now().toString(),
                    notes: newNote,
                },
            ]);
            setNewNote("");
        }
    };

    const removeNote = (id: string) => {
        setLegacyNotes(legacyNotes.filter((n) => n.id !== id));
    };

    const isNewItem = (id: string) => /^\d+$/.test(id);

    const fetchPatientProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.patients.getDoctorProfile(patient.id);
            const data = res.data as DoctorPatientProfileResponse;
            setProfileData(data);
            // set local slices
            setChronicConditions(data.medicalConditions?.chronicConditions || []);
            setAllergies(data.medicalConditions?.allergies || []);
            setCurrentSymptoms(data.currentSymptoms || []);
            setLegacyNotes(data.legacyNotes || []);
            setPrescriptions(data.prescriptions || []);
        } catch (err: any) {
            const msg = err?.message || "Failed to load patient profile";
            setError(msg);
            showErrorToast(msg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientProfile();
    }, [(patient as any).userId, dateFrom, dateTo, searchMedication]);

    // Save handler
    const handleSaveMedicalRecord = async () => {
        setIsSaving(true);
        try {
            await api.patients.updateMedicalConditions((patient as any).userId, {
                chronicConditions,
                allergies,
            });

            for (const symptom of currentSymptoms.filter((s) => isNewItem(s.id))) {
                await api.vitals.addVitals((patient as any).userId, { symptoms: symptom.title });
            }

            for (const note of legacyNotes.filter((n) => isNewItem(n.id!))) {
                await api.patients.createLegacyNote((patient as any).userId, { notes: note.notes! });
            }

            showSuccessToast("Medical records updated successfully");
            await fetchPatientProfile();
        } catch (err: any) {
            const msg = err?.message || "Failed to save medical records";
            showErrorToast(msg);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            {error && !isLoading && (
                <div className="text-center py-20">
                    <p className="text-destructive">{error}</p>
                    <Button onClick={fetchPatientProfile}>Retry</Button>
                </div>
            )}
            {/* Header */}
            <div className="mb-8">
                <Button variant="ghost" onClick={() => handleBackToList()} className="mb-4">
                    ← Back to Patients
                </Button>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Patient Profile
                </h1>
                <p className="text-muted-foreground">
                    Manage your patient profiles and medical records
                </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "health" | "info")}>
                <TabsList className="w-full h-18 py-1.5 mb-8">
                    <TabsTrigger value="health" className="font-medium">
                        Health Records
                    </TabsTrigger>
                    <TabsTrigger value="info" className="font-medium">
                        Patient Information
                    </TabsTrigger>
                </TabsList>
                {!isLoading && (
                    <>
                        <TabsContent value="health">
                            <div className="space-y-6">
                                <h3 className="text-2xl max-w-md mb-2">
                                    Medical Record for Hospital Patient
                                </h3>
                                <p>Update patient’s medical information and health records</p>
                                {/* Prescriptions Section */}
                                <Card className="p-6 border-0 border-l-4 border-l-primary rounded-none bg-secondary shadow-none">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-foreground mb-4">
                                            Prescriptions
                                        </h2>

                                        <Button className="mt-4 gap-2 bg-primary hover:bg-primary/90">
                                            <Plus className="h-4 w-4" />
                                            New Prescription
                                        </Button>
                                    </div>
                                    <div className="mb-6 space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-foreground mb-2 block">
                                                Search
                                            </label>
                                            <Input
                                                placeholder="Search Medication"
                                                value={searchMedication}
                                                className="bg-white border border-[#949494]"
                                                onChange={(e) => setSearchMedication(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-foreground mb-2 block">From</label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full bg-white border-[#949494] border! justify-start text-left text-muted-foreground">
                                                        <span>{dateFrom ? new Date(dateFrom).toLocaleDateString() : "Select date"}</span>
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
                                        <div>
                                            <label className="text-sm font-medium text-foreground mb-2 block">
                                                To
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full bg-white border-[#949494] border! justify-start text-left text-muted-foreground">
                                                        <span>{dateTo ? new Date(dateTo).toLocaleDateString() : "Select date"}</span>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={dateTo ? new Date(dateTo) : undefined}
                                                        onSelect={(d) => setDateTo(d ? d.toISOString().slice(0, 10) : "")}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                        Date
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                        Medication
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                        Dosage
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                        Frequency
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                        Notes
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {prescriptions?.map((rx) => (
                                                    <tr
                                                        key={rx.id}
                                                        className="border-b border-border hover:bg-muted/50"
                                                    >
                                                        <td className="py-3 px-4 text-foreground">{rx.createdAt}</td>
                                                        <td className="py-3 px-4 text-foreground font-medium">
                                                            {rx.medication}
                                                        </td>
                                                        <td className="py-3 px-4 text-foreground">
                                                            {rx.dosage}
                                                        </td>
                                                        <td className="py-3 px-4 text-foreground">
                                                            {rx.frequency}
                                                        </td>
                                                        <td className="py-3 px-4 text-muted-foreground">
                                                            {rx.notes}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>

                                {/* Additional Observations */}
                                <Card className="p-6 border-0 border-l-4 border-l-primary rounded-none bg-secondary shadow-none">
                                    <h2 className="text-xl font-bold text-foreground mb-6">
                                        Addition Observations
                                    </h2>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        {/* Chronic Conditions */}
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3">
                                                Chronic Conditions
                                            </h3>
                                            <Input
                                                placeholder="Search chronic condition and enter"
                                                value={newCondition}
                                                onChange={(e) => setNewCondition(e.target.value)}
                                                onKeyPress={(e) =>
                                                    e.key === "Enter" && addChronicCondition()
                                                }
                                                className="mb-3"
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                {chronicConditions.map((condition, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="outline"
                                                        className="gap-1 cursor-pointer hover:bg-muted"
                                                    >
                                                        {condition}
                                                        <X
                                                            className="h-3 w-3"
                                                            onClick={() => removeChronicCondition(idx)}
                                                        />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Allergies */}
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3">
                                                Allergies
                                            </h3>
                                            <Input
                                                placeholder="Search allergy and enter"
                                                value={newAllergy}
                                                onChange={(e) => setNewAllergy(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                                                className="mb-3"
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                {allergies.map((allergy, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="outline"
                                                        className="gap-1 cursor-pointer hover:bg-muted"
                                                    >
                                                        {allergy}
                                                        <X
                                                            className="h-3 w-3"
                                                            onClick={() => removeAllergy(idx)}
                                                        />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Current Symptoms */}
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3">
                                                Current Symptoms/Notes
                                            </h3>
                                            <Input
                                                placeholder="Search chronic condition and enter"
                                                value={newSymptom}
                                                onChange={(e) => setNewSymptom(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && addSymptom()}
                                                className="mb-3"
                                            />
                                            <div className="space-y-2">
                                                {currentSymptoms.map((symptom) => (
                                                    <div
                                                        key={symptom.id}
                                                        className="p-3 bg-muted rounded-lg text-sm flex justify-between items-start"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="text-foreground">{symptom.title}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {symptom.timestamp}
                                                            </p>
                                                        </div>
                                                        <X
                                                            className="h-4 w-4 text-destructive cursor-pointer flex-shrink-0 ml-2"
                                                            onClick={() => removeSymptom(symptom.id)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Legacy Notes */}
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3">
                                                Legacy Prescription Notes
                                            </h3>
                                            <Input
                                                placeholder="Enter Legacy Prescription Notes"
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && addNote()}
                                                className="mb-3"
                                            />
                                            <div className="space-y-2">
                                                {legacyNotes.map((note) => (
                                                    <div
                                                        key={note.id}
                                                        className="p-3 bg-muted rounded-lg text-sm flex justify-between items-start"
                                                    >
                                                        <p className="text-foreground flex-1">{note.notes}</p>
                                                        <X
                                                            className="h-4 w-4 text-destructive cursor-pointer shrink-0 ml-2"
                                                            onClick={() => removeNote(note.id!)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Save Button */}
                                <Button className="w-full" onClick={handleSaveMedicalRecord} disabled={isSaving || isLoading}>
                                    {isSaving ? "Saving..." : "Save Medical Record"}
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="info">
                            <div className="space-y-6">
                                {/* Personal Information */}
                                <Card className="p-6 border-0 border-l-4 border-l-primary rounded-none bg-secondary shadow-none">
                                    <h2 className="text-xl font-bold text-foreground mb-6">
                                        Personal Information
                                    </h2>

                                    <div className="flex items-start gap-6 mb-8">
                                        <img
                                            src={patient.profilePicture || "/placeholder.svg"}
                                            alt={patient.firstName}
                                            className="h-20 w-20 rounded-full"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {patient.firstName + " " + patient.lastName}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {patient.email}
                                            </p>
                                            {patient.hospital && <div className="flex items-center gap-1 text-sm text-primary mt-1">
                                                <MapPin className="h-4 w-4" />
                                                {patient.hospital}
                                            </div>}
                                            {
                                                !patient.hospital && <div className="flex items-center gap-1 text-sm text-primary mt-1">
                                                    <span>Independent Patient</span>
                                                </div>
                                            }
                                        </div>
                                    </div>


                                    {/* Patient Details Grid */}
                                    <div className="grid grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Phone</p>
                                            <p className="font-medium text-foreground">
                                                {patient.phoneNumber}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                Date of birth
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {formatDate(new Date(patient.dateOfBirth))}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Age</p>
                                            <p className="font-medium text-foreground">
                                                {patient.age}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                Total Appointments
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {patient.totalAppointments}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                Date Joined
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {patient.createdAt}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                Last Seen
                                            </p>
                                            {/* <p className="font-medium text-foreground">
                                    {formatDate(new Date(patient.lastAppointment))}
                                </p> */}
                                        </div>
                                    </div>
                                </Card>

                                {/* Additional Observations */}
                                <Card className="p-6 border-0 border-l-4 border-l-primary rounded-none bg-secondary shadow-none">
                                    <h2 className="text-xl font-bold text-foreground mb-6">
                                        Additional Observations
                                    </h2>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3">
                                                Chronic Conditions
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {chronicConditions.map((condition, idx) => (
                                                    <Badge key={idx} variant="outline">
                                                        {condition}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3">
                                                Allergies
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {allergies.map((allergy, idx) => (
                                                    <Badge key={idx} variant="outline">
                                                        {allergy}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3">
                                                Current Symptoms/Notes
                                            </h3>
                                            <div className="space-y-2">
                                                {currentSymptoms.map((symptom) => (
                                                    <div
                                                        key={symptom.id}
                                                        className="p-3 bg-muted rounded-lg text-sm"
                                                    >
                                                        <p className="text-foreground">{symptom.title}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {symptom.timestamp}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3">
                                                Legacy Prescription Notes
                                            </h3>
                                            <div className="space-y-2">
                                                {legacyNotes.map((note) => (
                                                    <div
                                                        key={note.id}
                                                        className="p-3 bg-muted rounded-lg text-sm"
                                                    >
                                                        <p className="text-foreground">{note.notes}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Current Prescriptions */}
                                <Card className="p-6 border-0 border-l-4 border-l-primary rounded-none bg-secondary shadow-none">
                                    <h2 className="text-xl font-bold text-foreground mb-4">
                                        Current Prescriptions
                                    </h2>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                        Date
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                        Medication
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                        Dosage
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                        Frequency
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                        Notes
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {prescriptions?.map((rx) => (
                                                    <tr
                                                        key={rx.id}
                                                        className="border-b border-border hover:bg-muted/50"
                                                    >
                                                        <td className="py-3 px-4 text-foreground">{rx.createdAt}</td>
                                                        <td className="py-3 px-4 text-foreground font-medium">
                                                            {rx.medication}
                                                        </td>
                                                        <td className="py-3 px-4 text-foreground">
                                                            {rx.dosage}
                                                        </td>
                                                        <td className="py-3 px-4 text-foreground">
                                                            {rx.frequency}
                                                        </td>
                                                        <td className="py-3 px-4 text-muted-foreground">
                                                            {rx.notes}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>
                    </>
                )}
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="animate-spin h-8 w-8 text-primary" />
                    </div>
                )}
            </Tabs>

        </div>
    );
}

export default DoctorPatientProfile