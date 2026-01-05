import type React from "react"
import { memo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Building2, Search } from "lucide-react"
import type { FormData } from "../ProgressiveOnboarding"
import { api } from "@/lib/api"
import type { Hospital } from "@/types/interfaces"
import { Icon } from "@iconify/react"

interface HospitalAffiliationProps {
    formData: FormData
    onInputChange: (field: string, value: string | Hospital) => void
}

export const HospitalAffiliation = memo(({ formData, onInputChange }: HospitalAffiliationProps) => {
    const [affiliationType, setAffiliationType] = useState<string>(formData.hospitalId || "")
    const [hospitalSearch, setHospitalSearch] = useState<string>("")
    const [searchResults, setSearchResults] = useState<Hospital[]>([])
    const [showHospitalSearch, setShowHospitalSearch] = useState(false)

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setHospitalSearch(e.target.value)
            const response = await api.hospitals.search(e.target.value)
            setSearchResults(response.data.hospitals)
        } catch (error) {
            console.log(error)
        }
    }

    // Handle affiliation type change
    const handleAffiliationChange = (value: string) => {
        setAffiliationType(value)
        onInputChange("affiliationType", value)

        if (value === "affiliated") {
            setShowHospitalSearch(true)
        } else {
            setShowHospitalSearch(false)
            onInputChange("hospitalId", "")
            onInputChange("hospital", "")
            setHospitalSearch("")
            setSearchResults([])
        }
    }

    // Handle hospital selection
    const handleHospitalSelect = (hospitalId: string) => {
        const selectedHospital: Hospital | undefined = searchResults.find((h) => h.id === hospitalId)
        if (selectedHospital) {
            onInputChange("hospitalId", hospitalId)
            onInputChange("hospital", selectedHospital)
            setHospitalSearch("")
        }
    }

    // Only show this component for patients and doctors
    if (formData.role === "hospital_admin") {
        return null
    }

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-none">
                <CardHeader className="space-y-3 p-0">
                    <CardDescription className="text-base leading-relaxed max-w-md">
                        {formData.role === "patient"
                            ? "Choose whether you want to be affiliated with a specific hospital or continue as an independent patient."
                            : "Choose whether you want to be affiliated with a specific hospital or practice independently."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-0">
                    <div className="space-y-4">
                        <Label className="text-base font-medium text-foreground">Affiliation Status</Label>
                        <RadioGroup value={affiliationType} onValueChange={handleAffiliationChange} className="space-y-3">
                            <div className="flex items-start space-x-3 p-4 border-2 rounded-xl hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 cursor-pointer">
                                <RadioGroupItem value="affiliated" id="affiliated" className="mt-1" />
                                <Label htmlFor="affiliated" className="flex items-start gap-3 cursor-pointer flex-1">
                                    <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                                        <Icon icon="mdi:hospital" className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-semibold text-foreground text-base">Affiliated with Hospital</div>
                                        <div className="text-sm text-muted-foreground leading-relaxed">
                                            {formData.role === "patient"
                                                ? "I want to be associated with a specific hospital"
                                                : "I practice at or am employed by a specific hospital"}
                                        </div>
                                    </div>
                                </Label>
                            </div>

                            <div className="flex items-start space-x-3 p-4 border-2 rounded-xl hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 cursor-pointer">
                                <RadioGroupItem value="independent" id="independent" className="mt-1" />
                                <Label htmlFor="independent" className="flex items-start gap-3 cursor-pointer flex-1">
                                    <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                                        {formData.role === "patient" ? <Icon icon="medical-icon:i-outpatient" className="h-5 w-5 text-primary" /> : <Icon icon="maki:doctor" className="h-5 w-5 text-primary" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-semibold text-foreground text-base">
                                            {formData.role === "patient" ? "Independent Patient" : "Independent Practice"}
                                        </div>
                                        <div className="text-sm text-muted-foreground leading-relaxed">
                                            {formData.role === "patient"
                                                ? "I prefer not to be affiliated with any specific hospital"
                                                : "I run my own practice or work independently"}
                                        </div>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {showHospitalSearch && affiliationType === "affiliated" && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="space-y-3">
                                <Label htmlFor="hospital-search" className="text-base font-medium text-foreground">
                                    Search & Select Hospital
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="hospital-search"
                                        value={hospitalSearch}
                                        onChange={(e) => handleSearchChange(e)}
                                        placeholder="Type hospital name or location..."
                                        className="pl-12 h-14 rounded-xl text-base"
                                    />
                                </div>

                                {/* Live search results */}
                                {hospitalSearch.trim() !== "" && (
                                    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                                        {searchResults.length > 0 ? (
                                            searchResults.map((hospital) => (
                                                <button
                                                    key={hospital.id}
                                                    type="button"
                                                    onClick={() => {
                                                        handleHospitalSelect(hospital.id)
                                                        setHospitalSearch(hospital.name)
                                                    }}
                                                    className={`w-full text-left p-4 hover:bg-accent border-b last:border-b-0 transition-colors ${formData.hospitalId === hospital.id ? "bg-primary/5 border-primary/20" : ""
                                                        }`}
                                                >
                                                    <div className="font-semibold text-foreground">{hospital.name}</div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {hospital.address}, {hospital.state}
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-4 text-muted-foreground text-center text-sm">
                                                No hospitals found matching "{hospitalSearch}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {formData.hospital && (
                                <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <Building2 className="h-5 w-5" />
                                        <span>Selected Hospital:</span>
                                    </div>
                                    <div className="text-foreground mt-2 leading-relaxed">
                                        {formData.hospital.name}, {formData.hospital.address}, {formData.hospital.state}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {affiliationType === "independent" && (
                        <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-xl animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                {formData.role == "patient" ? <Icon icon="mdi:hospital" className="h-5 w-5" /> : <Icon icon="maki:doctor" className="h-5 w-5" />}
                                <span>{formData.role === "patient" ? "Independent Patient" : "Independent Practice"}</span>
                            </div>
                            <div className="text-foreground text-sm mt-2 leading-relaxed">
                                {formData.role === "patient"
                                    ? "You will have access to all healthcare providers on the platform."
                                    : "You can accept patients from anywhere and manage your own practice."}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
})

HospitalAffiliation.displayName = "HospitalAffiliation"
