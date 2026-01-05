"use client"

import { memo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { FormData } from "../ProgressiveOnboarding"
import { GHANA_STATES } from "@/utils/constants"

interface PersonalInfoFieldsProps {
  formData: FormData
  onInputChange: (field: string, value: string) => void
}

export const PersonalInfoFields = memo(({ formData, onInputChange }: PersonalInfoFieldsProps) => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [countryCode, setCountryCode] = useState("+233")

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-base font-medium text-foreground">
            First Name
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onInputChange("firstName", e.target.value)}
            placeholder="First Name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base font-medium text-foreground">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onInputChange("lastName", e.target.value)}
            placeholder="Last Name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-base font-medium text-foreground">
          Email
        </Label>
        <Input
          id="signup-email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          placeholder="Email address"
          required
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-base font-medium text-foreground">
          Phone number
        </Label>
        <div className="flex gap-2">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="h-14 w-32 ">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇬🇭</span>
                  <span>{countryCode}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+233">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇬🇭</span>
                  <span>+233</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onInputChange("phone", e.target.value)}
            placeholder="024XXXXXXX"
            required
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="niaCard" className="text-base font-medium text-foreground">
          National Identification Card Number (NIA Card)
        </Label>
        <Input
          id="niaCard"
          value={formData.identificationNumber}
          onChange={(e) => onInputChange("identificationNumber", e.target.value)}
          placeholder="XXXXXXXXXX"
        />
      </div>

      {formData.role != "hospital_admin" && (
        <div className="space-y-2">
          <Label htmlFor="nhisNumber" className="text-base font-medium text-foreground">
            NHIS Number <span className="text-sm italic text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            id="nhisNumber"
            value={formData.nhisNumber}
            onChange={(e) => onInputChange("nhisNumber", e.target.value)}
            placeholder="XXXXXXXXXX"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="address" className="text-base font-medium text-foreground">
          Address
        </Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onInputChange("address", e.target.value)}
          placeholder="Street Address, P.O. Box, Company name, c/o"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-base font-medium text-foreground">
            Country
          </Label>
          <Select value={formData.country} onValueChange={(value) => onInputChange("country", value)}>
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
          <Label htmlFor="State" className="text-base font-medium text-foreground">
            State
          </Label>
          <Select value={formData.city} onValueChange={(value) => onInputChange("city", value)}>
            <SelectTrigger className="h-14 ">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {GHANA_STATES.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-base font-medium text-foreground">
            Date of Birth
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full h-14 justify-between font-normal text-muted-foreground bg-primary/5"
              >
                {date ? date.toLocaleDateString("en-GB") : "dd/mm/yyyy"}
                <CalendarIcon className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date)
                  onInputChange("dateOfBirth", new Date(date!).toISOString())
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-base font-medium text-foreground">
            Gender
          </Label>
          <Select value={formData.gender} onValueChange={(value) => onInputChange("gender", value)}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* PIN fields for patients and doctors */}
      {(formData.role === "patient" || formData.role === "doctor") && (
        <div className="space-y-4 pt-4 border-t">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Create Your PIN</p>
            <p className="text-xs text-blue-700">
              Create a 6-digit PIN for quick and secure access to your account
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-base font-medium text-foreground">
                PIN (6 digits)
              </Label>
              <Input
                id="pin"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={formData.pin || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  onInputChange("pin", value)
                }}
                placeholder="000000"
                required
                className="text-center text-2xl tracking-widest font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPin" className="text-base font-medium text-foreground">
                Confirm PIN
              </Label>
              <Input
                id="confirmPin"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={formData.confirmPin || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  onInputChange("confirmPin", value)
                }}
                placeholder="000000"
                required
                className="text-center text-2xl tracking-widest font-mono"
              />
            </div>
          </div>
          {formData.pin && formData.confirmPin && formData.pin !== formData.confirmPin && (
            <p className="text-sm text-red-500">PINs don't match</p>
          )}
        </div>
      )}
    </div>
  )
})

PersonalInfoFields.displayName = "PersonalInfoFields"
