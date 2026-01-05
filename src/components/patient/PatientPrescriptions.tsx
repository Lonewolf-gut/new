import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useMedicalRecordStore } from "@/stores/medicalRecordStore"


export function PatientPrescriptions() {
    const [searchQuery, setSearchQuery] = useState("")
    const [fromDate, setFromDate] = useState<Date>()
    const [toDate, setToDate] = useState<Date>()
    const prescriptions = useMedicalRecordStore((state) => state.prescriptions);

    const filteredPrescriptions = prescriptions.filter((prescription) => {
        const matchesSearch = prescription?.medication?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    return (
        <div className="space-y-12 ">
            {/* Filter Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:filter-outline" className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Filter</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Search</label>
                        <Input
                            placeholder="Search Medication"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 rounded-xl"
                        />
                    </div>

                    {/* From Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">From</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-12 rounded-xl justify-start text-left font-normal",
                                        !fromDate && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {fromDate ? format(fromDate, "dd/MM/yyyy") : "dd/mm/yyyy"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* To Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">To</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-12 rounded-xl justify-start text-left font-normal",
                                        !toDate && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {toDate ? format(toDate, "dd/MM/yyyy") : "dd/mm/yyyy"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Prescriptions Table */}
            <div className="bg-transparent">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Medication</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Dosage</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Frequency</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPrescriptions.length > 0 ? (
                            filteredPrescriptions.map((prescription) => (
                                <TableRow key={prescription.id}>
                                    <TableCell className="font-medium">{prescription.createdAt}</TableCell>
                                    <TableCell>{prescription.medication}</TableCell>
                                    <TableCell>{prescription.dosage}</TableCell>
                                    <TableCell>{prescription.frequency}</TableCell>
                                    <TableCell>{prescription.notes}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No prescriptions found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default PatientPrescriptions
