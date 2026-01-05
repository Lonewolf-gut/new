import { memo } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FileText, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { GHANAIAN_REGIONS, SPECIALTIES } from '@/utils/constants';

interface ProfessionalDetailsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  hospitals: any[];
  hospitalsLoading: boolean;
}

export const ProfessionalDetailsStep = memo(({
  formData,
  updateFormData,

}: ProfessionalDetailsStepProps) => {

  if (formData.role === 'doctor') {
    return (
      <div className="space-y-6">
        {/* Medical Specialty */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="specialty" className="text-sm font-medium text-foreground">
            Medical specialty
          </Label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Select
              value={formData.specialty}
              onValueChange={(value) => updateFormData({ specialty: value })}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select your specialty" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* License Number */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="licenseNumber" className="text-sm font-medium text-foreground">
            Medical license number <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => updateFormData({ licenseNumber: e.target.value })}
              placeholder="Enter your license number (e.g., MD/12345)"
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your medical license will be verified before account approval. Include prefix if applicable (e.g., MD/, DR/, etc.)
          </p>
          {formData.licenseNumber && formData.licenseNumber.length >= 4 && (
            <p className="text-xs text-green-600">
              License format looks good ✓
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  if (formData.role === 'hospital_admin') {
    return (
      <div className="space-y-6">
        {/* Hospital Name */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="hospitalName" className="text-sm font-medium text-foreground">
            Hospital name
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="hospitalName"
              value={formData.hospitalName}
              onChange={(e) => updateFormData({ hospitalName: e.target.value })}
              placeholder="Enter hospital name"
              className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
            />
          </div>
        </motion.div>

        {/* Hospital Address */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="hospitalAddress" className="text-sm font-medium text-foreground">
            Hospital address
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="hospitalAddress"
              value={formData.hospitalAddress}
              onChange={(e) => updateFormData({ hospitalAddress: e.target.value })}
              placeholder="Enter hospital address"
              className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="hospitalCity" className="text-sm font-medium text-foreground">
              City
            </Label>
            <Input
              id="hospitalCity"
              value={formData.hospitalCity}
              onChange={(e) => updateFormData({ hospitalCity: e.target.value })}
              placeholder="Enter city"
              className="h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Label htmlFor="hospitalRegion" className="text-sm font-medium text-foreground">
              Region
            </Label>
            <Select
              value={formData.hospitalRegion}
              onValueChange={(value) => updateFormData({ hospitalRegion: value })}
            >
              <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background/50">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {GHANAIAN_REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        {/* Hospital Phone and Email */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="hospitalPhone" className="text-sm font-medium text-foreground">
              Phone
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="hospitalPhone"
                value={formData.hospitalPhone}
                onChange={(e) => updateFormData({ hospitalPhone: e.target.value })}
                placeholder="+233 XX XXX XXXX"
                className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
              />
            </div>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Label htmlFor="hospitalEmail" className="text-sm font-medium text-foreground">
              Hospital email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="hospitalEmail"
                type="email"
                value={formData.hospitalEmail}
                onChange={(e) => updateFormData({ hospitalEmail: e.target.value })}
                placeholder="admin@hospital.com"
                className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
              />
            </div>
          </motion.div>
        </div>

        {/* Registration Numbers */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label htmlFor="hospitalRegistrationNumber" className="text-sm font-medium text-foreground">
              Registration number
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="hospitalRegistrationNumber"
                value={formData.hospitalRegistrationNumber}
                onChange={(e) => updateFormData({ hospitalRegistrationNumber: e.target.value })}
                placeholder="Hospital registration #"
                className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
              />
            </div>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Label htmlFor="hospitalLicenseNumber" className="text-sm font-medium text-foreground">
              License number
            </Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="hospitalLicenseNumber"
                value={formData.hospitalLicenseNumber}
                onChange={(e) => updateFormData({ hospitalLicenseNumber: e.target.value })}
                placeholder="Hospital license #"
                className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-colors"
              />
            </div>
          </motion.div>
        </div>

        {/* Note */}
        <motion.div
          className="p-4 bg-accent/30 rounded-lg border border-border/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-foreground/80">
            Your hospital registration will be reviewed before approval. Additional settings can be configured later.
          </p>
        </motion.div>
      </div>
    );
  }

  if (formData.role === 'patient') {
    return (
      <div className="space-y-6">
        {/* Note */}
        <motion.div
          className="p-4 bg-accent/30 rounded-lg border border-border/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm text-foreground/80">
            Your hospital affiliation has been set. Additional medical information and preferences can be added later in your profile.
          </p>
        </motion.div>
      </div>
    );
  }

  return null;
});

ProfessionalDetailsStep.displayName = 'ProfessionalDetailsStep';