import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Building, Calendar } from "lucide-react"
import { useState } from "react"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { usePatientQuery } from "@/hooks/usePatientQuery"
import { usePatientDataStore } from "@/stores/patientDataStore"
import { Icon } from "@iconify/react"

export function AvailableDoctors() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSpecialty, setSelectedSpecialty] = useState("all")

    usePatientQuery();
    const doctors = usePatientDataStore((state) => state.doctors);

    console.log(doctors)

    const filteredDoctors = doctors?.filter((doctor) => {
        const matchesSearch =
            searchQuery === "" ||
            `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty

        return matchesSearch && matchesSpecialty
    })

    // Get unique specialties for filter
    const specialties = [...new Set(doctors?.map((doctor) => doctor.specialty))]

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < Math.floor(rating) ? "fill-yellow-500 text-yellow-500" : "fill-gray-300 text-gray-300"
                    }`}
            />
        ))
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-primary mb-2">Find Your Doctor</h2>
                <p className="text-muted-foreground">
                    Showing {filteredDoctors?.length} doctor{filteredDoctors?.length !== 1 ? "s" : ""} available
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                        placeholder="Search doctors by name, specialty..."
                        className="pl-10 h-14 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="w-full md:w-64 h-14 rounded-xl">
                        <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Specialties</SelectItem>
                        {specialties &&
                            specialties.map((specialty) => (
                                <SelectItem key={specialty} value={specialty!}>
                                    {specialty}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {!doctors ? (
                    <div className="col-span-3">
                        <LoadingSpinner text="Loading doctors..." />
                    </div>
                ) : (
                    filteredDoctors?.map((doctor) => (
                        <Card key={doctor.id} className="shadow-none transition-shadow">
                            <CardContent className="">
                                {/* Doctor Info */}
                                <div className="flex items-start gap-4 mb-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage
                                            src={doctor?.profilePicture || "/caring-doctor.png"}
                                            alt={`${doctor.firstName} ${doctor.lastName}`}
                                        />
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                            {doctor.firstName.charAt(0)}
                                            {doctor.lastName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-foreground mb-1">
                                            Dr. {doctor.firstName} {doctor.lastName}
                                        </h3>
                                        {doctor.hospital && <Badge variant="outline" className="text-xs text-primary border-primary">
                                            <Building className="w-3 h-3 mr-1" />
                                            Hospital
                                        </Badge>}
                                        {
                                            doctor.specialty && (<p className="text-sm text-muted-foreground mt-1">{doctor.specialty}</p>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex gap-1">{renderStars(doctor.averageRating || 0)}</div>
                                    <span className="text-sm text-muted-foreground">
                                        {doctor.averageRating?.toFixed(1) || "0.0"} ({doctor.ratingCount || 0} reviews)
                                    </span>
                                </div>

                                <Button className="mt-8 w-full">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Book Now
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {
                !doctors && filteredDoctors?.length === 0 && (
                    <Card className="shadow-none border-0">
                        <CardContent className="p-12 text-center text-muted-foreground/60">
                            <Icon icon="maki:doctor" className="mx-auto mb-4" width="48" height="48" />
                            <p>No doctors found. Try adjusting your search criteria.</p>
                        </CardContent>
                    </Card>
                )
            }
        </div >
    )
}

export default AvailableDoctors;
