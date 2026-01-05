import { memo } from "react"
import { ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GHANA_STATES } from "@/utils/constants"

interface HospitalDetailsStepProps {
  formData: any
  updateFormData: (data: any) => void
  loading?: boolean
}

export const HospitalDetailsStep = memo(({ formData, updateFormData }: HospitalDetailsStepProps) => {
  const countryCode = "+233"

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-8">

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hospitalName" className="text-base font-normal text-foreground">
            Hospital/Facility name<span className="text-destructive">*</span>
          </Label>
          <Input
            id="hospitalName"
            value={formData.hospitalName || ""}
            onChange={(e) => handleInputChange("hospitalName", e.target.value)}
            placeholder="Enter hospital name"
            required
            className="h-14 rounded-xl border-input bg-background"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hospitalEmail" className="text-base font-normal text-foreground">
              Hospital Email<span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="hospitalEmail"
                type="email"
                value={formData.hospitalEmail || ""}
                onChange={(e) => handleInputChange("hospitalEmail", e.target.value)}
                placeholder="Enter hospital email"
                required
                className="h-14 rounded-xl border-input bg-background pr-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalPhone" className="text-base font-normal text-foreground">
              Hospital Phone<span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                <span className="text-2xl">🇬🇭</span>
                <span className="text-sm font-medium">{countryCode}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="hospitalPhone"
                type="tel"
                value={formData.hospitalPhone || ""}
                onChange={(e) => handleInputChange("hospitalPhone", e.target.value)}
                placeholder="XXXXXXX"
                required
                className="h-14 rounded-xl border-input bg-background pl-32"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hospitalAddress" className="text-base font-normal text-foreground">
            Hospital Address<span className="text-destructive">*</span>
          </Label>
          <Input
            id="hospitalAddress"
            value={formData.hospitalAddress || ""}
            onChange={(e) => handleInputChange("hospitalAddress", e.target.value)}
            placeholder="Enter hospital address"
            required
            className="h-14 rounded-xl border-input bg-background"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hospitalCity" className="text-base font-normal text-foreground">
              Country<span className="text-destructive">*</span>
            </Label>
            <Select value={formData.hospitalCountry} onValueChange={(value) => handleInputChange("hospitalCountry", value)}>
              <SelectTrigger className="h-14 ">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GHANA" defaultChecked={true}>
                  Ghana
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalRegion" className="text-base font-normal text-foreground">
              Region<span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.hospitalState || ""}
              onValueChange={(value) => handleInputChange("hospitalState", value)}
            >
              <SelectTrigger className="h-14 rounded-xl border-input bg-background">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {GHANA_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hospitalRegistrationNumber" className="text-base font-normal text-foreground">
              Registration Number<span className="text-destructive">*</span>
            </Label>
            <Input
              id="hospitalRegistrationNumber"
              value={formData.hospitalRegistrationNumber || ""}
              onChange={(e) => handleInputChange("hospitalRegistrationNumber", e.target.value)}
              placeholder="XXXXXXXXX"
              required
              className="h-14 rounded-xl border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalLicenseNumber" className="text-base font-normal text-foreground">
              License Number<span className="text-destructive">*</span>
            </Label>
            <Input
              id="hospitalLicenseNumber"
              value={formData.hospitalLicenseNumber || ""}
              onChange={(e) => handleInputChange("hospitalLicenseNumber", e.target.value)}
              placeholder="XXXXXXXXX"
              required
              className="h-14 rounded-xl border-input bg-background"
            />
          </div>
        </div>
      </div>
    </div>
  )
})

HospitalDetailsStep.displayName = "HospitalDetailsStep"
