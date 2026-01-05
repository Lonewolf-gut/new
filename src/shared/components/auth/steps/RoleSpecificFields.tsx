import { memo } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface FormData {
  role: string;
  specialty: string;
  licenseNumber: string;
  hospitalId: string;
  hospitalName: string;
  hospitalEmail: string;
  hospitalAddress: string;
  hospitalCity: string;
  hospitalRegion: string;
  hospitalPhone: string;
  hospitalRegistrationNumber: string;
  hospitalLicenseNumber: string;
}

interface RoleSpecificFieldsProps {
  formData: FormData;
  hospitals: any[];
  hospitalsLoading: boolean;
  onInputChange: (field: string, value: string) => void;
}

const medicalSpecialties = [
  "General Practice",
  "Internal Medicine",
  "Pediatrics",
  "Obstetrics and Gynecology",
  "Surgery",
  "Cardiology",
  "Dermatology",
  "Psychiatry",
  "Neurology",
  "Orthopedics",
  "Ophthalmology",
  "Radiology",
  "Anesthesiology",
  "Emergency Medicine",
  "Family Medicine",
  "Oncology",
  "Urology",
  "Dentistry",
  "Other"
];

const ghanaianRegions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Brong-Ahafo",
  "Western North",
  "Ahafo",
  "Bono East",
  "Oti",
  "North East",
  "Savannah"
];

export const RoleSpecificFields = memo(({ 
  formData, 
  hospitals, 
  hospitalsLoading, 
  onInputChange 
}: RoleSpecificFieldsProps) => {
  if (formData.role === "doctor") {
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="specialty">Medical Specialty</Label>
          <Select 
            value={formData.specialty} 
            onValueChange={(value) => onInputChange("specialty", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your specialty" />
            </SelectTrigger>
            <SelectContent>
              {medicalSpecialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseNumber">Medical License Number</Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => onInputChange("licenseNumber", e.target.value)}
            placeholder="Enter your medical license number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hospitalId">Hospital Affiliation (Optional)</Label>
          <Select
            value={formData.hospitalId}
            onValueChange={(value) => onInputChange("hospitalId", value)}
            // Allow selection even while loading so users can choose "independent"
            disabled={false}
          >
            <SelectTrigger>
              {hospitalsLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <SelectValue placeholder={hospitalsLoading ? "Loading hospitals..." : "Select hospital or work independently"} />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover text-popover-foreground">
              <SelectItem value="independent">Work Independently</SelectItem>
              {hospitals?.map((hospital) => (
                <SelectItem key={hospital.id} value={hospital.id}>
                  {hospital.name} - {hospital.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </>
    );
  }

  if (formData.role === "patient") {
    return (
      <div className="space-y-2">
        <Label htmlFor="hospitalId">Preferred Hospital (Optional)</Label>
        <Select
          value={formData.hospitalId}
          onValueChange={(value) => onInputChange("hospitalId", value)}
          disabled={false}
        >
          <SelectTrigger>
            {hospitalsLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <SelectValue placeholder={hospitalsLoading ? "Loading hospitals..." : "Select preferred hospital or none"} />
          </SelectTrigger>
          <SelectContent className="z-50 bg-popover text-popover-foreground">
            <SelectItem value="independent">No specific preference</SelectItem>
            {hospitals?.map((hospital) => (
              <SelectItem key={hospital.id} value={hospital.id}>
                {hospital.name} - {hospital.city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (formData.role === "hospital_admin") {
    return (
      <>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Hospital Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="hospitalName">Hospital Name</Label>
            <Input
              id="hospitalName"
              value={formData.hospitalName}
              onChange={(e) => onInputChange("hospitalName", e.target.value)}
              placeholder="Enter hospital name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalEmail">Hospital Email</Label>
            <Input
              id="hospitalEmail"
              type="email"
              value={formData.hospitalEmail}
              onChange={(e) => onInputChange("hospitalEmail", e.target.value)}
              placeholder="Enter hospital email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalAddress">Hospital Address</Label>
            <Input
              id="hospitalAddress"
              value={formData.hospitalAddress}
              onChange={(e) => onInputChange("hospitalAddress", e.target.value)}
              placeholder="Enter hospital address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hospitalCity">City</Label>
              <Input
                id="hospitalCity"
                value={formData.hospitalCity}
                onChange={(e) => onInputChange("hospitalCity", e.target.value)}
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospitalRegion">Region</Label>
              <Select
                value={formData.hospitalRegion}
                onValueChange={(value) => onInputChange("hospitalRegion", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {ghanaianRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalPhone">Hospital Phone</Label>
            <Input
              id="hospitalPhone"
              type="tel"
              value={formData.hospitalPhone}
              onChange={(e) => onInputChange("hospitalPhone", e.target.value)}
              placeholder="Enter hospital phone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalRegistrationNumber">Hospital Registration Number</Label>
            <Input
              id="hospitalRegistrationNumber"
              value={formData.hospitalRegistrationNumber}
              onChange={(e) => onInputChange("hospitalRegistrationNumber", e.target.value)}
              placeholder="Enter registration number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalLicenseNumber">Hospital License Number</Label>
            <Input
              id="hospitalLicenseNumber"
              value={formData.hospitalLicenseNumber}
              onChange={(e) => onInputChange("hospitalLicenseNumber", e.target.value)}
              placeholder="Enter license number"
            />
          </div>
        </div>
      </>
    );
  }

  return null;
});

RoleSpecificFields.displayName = 'RoleSpecificFields';