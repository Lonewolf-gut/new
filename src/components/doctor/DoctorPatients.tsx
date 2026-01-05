import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Icon } from "@iconify/react";
import type { DoctorPatient } from "@/types/interfaces";
import { useDoctorDataStore } from "@/stores/doctorDataStore";
import DoctorPatientProfile from "./DoctorPatientProfile";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { useDoctorQuery } from "@/hooks/useDoctorQuery";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function DoctorPatients() {
    useDoctorQuery();
    const patients = useDoctorDataStore((state) => state.patients);
    const [view, setView] = useState<"list" | "profile">("list");
    const [selectedPatient, setSelectedPatient] = useState<DoctorPatient | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPatients = patients?.filter(
        (patient) =>
            patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phoneNumber.includes(searchTerm)
    );

    const handleSelectPatient = (patient: DoctorPatient) => {
        setSelectedPatient(patient);
        setView("profile");
    };

    const handleBackToList = () => {
        setView("list");
        setSelectedPatient(null);
    };

    // Patient List View
    if (view === "list") {
        return (
            <div className="w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Patient Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your patient profiles and medical records
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search patients by name, email or phone"
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter and Sort */}
                <div className="gap-4 mb-6 hidden">
                    <Button variant="outline" className="gap-2 bg-transparent">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" className="gap-2 bg-transparent">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort by
                    </Button>
                </div>

                {/* Patient List */}
                <div className="p-5 bg-secondary rounded-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Icon
                            icon="fluent:patient-32-regular"
                            className="text-primary w-8 h-8"
                        />
                        <h2 className="text-xl font-semibold text-primary">
                            Patient List ({filteredPatients?.length ?? 0})
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPatients &&
                            filteredPatients.length > 0 &&
                            filteredPatients?.map((patient) => (
                                <Card
                                    key={patient.id}
                                    className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() => handleSelectPatient(patient)}
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={patient.profilePicture} alt={patient.firstName} />
                                            <AvatarFallback>{patient.firstName[0]}{patient.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground">
                                                {patient.firstName} {patient.lastName}
                                            </h3>
                                            <div className="flex items-center gap-1 text-sm text-primary">

                                                {patient.hospital ?? "Indepdent Patient"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-black">
                                            <Icon
                                                icon="material-symbols:mail-outline"
                                                className="h-4 w-4 text-primary"
                                            />
                                            {patient.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-black">
                                            <Icon
                                                icon="material-symbols:call-outline"
                                                className="h-4 w-4 text-primary"
                                            />
                                            {patient.phoneNumber}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            Last Appointment:{" "}
                                            <span className="font-medium">
                                                {patient.lastAppointment ?? "N/A"}
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground">
                                            Appointments:{" "}
                                            <span className="font-medium">
                                                {patient.totalAppointments}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            Status:{" "}
                                            <Badge
                                                variant={patient.isActive ? "default" : "secondary"}
                                                className="bg-green-100 text-green-800"
                                            >
                                                {patient.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}

                    </div>
                    {filteredPatients && filteredPatients.length === 0 && (
                        <div className="py-4 w-full text-center">
                            <p className="text-muted-foreground">You have no patients.</p>
                        </div>
                    )}{!patients &&
                        (
                            <div className="w-full flex items-center justify-center relative">
                                <LoadingSpinner text="Loading patients" />
                            </div>
                        )}
                </div>
            </div>
        );
    }

    // Patient Profile View
    if (view === "profile" && selectedPatient) {
        return (
            <DoctorPatientProfile
                patient={selectedPatient}
                handleBackToList={handleBackToList}
            />
        );
    }

    return null;
}
