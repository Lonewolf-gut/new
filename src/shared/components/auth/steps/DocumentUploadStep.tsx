import { memo, useState } from "react"
import { motion } from "framer-motion"
import { FileText, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload"
import { Icon } from "@iconify/react"
import { showErrorToast, showInfoToast, showSuccessToast } from "@/lib/toast"

interface DocumentUploadStepProps {
  formData: any
  updateFormData: (key: string, value: string | any[]) => void
  loading?: boolean
  authenticatedUser?: any
}

export const DocumentUploadStep = memo(({ formData, updateFormData }: DocumentUploadStepProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: { file: File; url?: string; publicId?: string; uploading?: boolean }
  }>({})
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: boolean }>({})

  const { uploadFile, deleteFile } = useCloudinaryUpload()

  const requiredDocuments =
    formData.role === "doctor"
      ? [
        {
          id: "medical_license",
          title: "Medical License",
          description: "Upload your current medical license certificate",
          required: true,
          icon: Shield,
        },
        {
          id: "specialty_certificate",
          title: "Specialty Certificate",
          description: "Upload your specialty certification (if applicable)",
          required: false,
          icon: FileText,
        },
        {
          id: "id_document",
          title: "Government ID",
          description: "Upload a copy of your national ID or passport",
          required: true,
          icon: FileText,
        },
      ]
      : [
        {
          id: "hospital_license",
          title: "Hospital Operating License",
          description: "Upload your hospital's operating license",
          required: true,
          icon: Shield,
        },
        {
          id: "registration_certificate",
          title: "Business Registration",
          description: "Upload business registration certificate",
          required: true,
          icon: FileText,
        },
        {
          id: "admin_authorization",
          title: "Authorization Letter",
          description: "Letter authorizing you as hospital administrator",
          required: true,
          icon: FileText,
        },
      ]

  const handleFileUpload = async (documentId: string, file: File) => {
    setUploadProgress((prev) => ({ ...prev, [documentId]: true }))
    setUploadedFiles((prev) => ({
      ...prev,
      [documentId]: { file, uploading: true },
    }))

    try {
      const result = await uploadFile(file, {
        folder: `documents/${formData.role}/${documentId}`,
        resourceType: "auto",
        tags: [formData.role, documentId, "verification"],
      })

      if (result.success && result.url) {
        setUploadedFiles((prev) => ({
          ...prev,
          [documentId]: {
            file,
            url: result.url,
            publicId: result.publicId,
            uploading: false,
          },
        }))

        updateFormData("uploadedDocuments", [
          ...formData.uploadedDocuments,
          {
            name: documentId,
            url: result.url,
            publicId: result.publicId,
          },
        ])

        showSuccessToast("Success", "Document uploaded successfully")
      } else {
        setUploadedFiles((prev) => {
          const newState = { ...prev }
          delete newState[documentId]
          return newState
        })

        showErrorToast("Upload failed", result.error || "Unknown error occurred")
      }
    } catch (error) {
      console.error("Upload error:", error)

      setUploadedFiles((prev) => {
        const newState = { ...prev }
        delete newState[documentId]
        return newState
      })

      showErrorToast("Upload failed: An unexpected error occurred")
    } finally {
      setUploadProgress((prev) => ({ ...prev, [documentId]: false }))
    }
  }

  const handleFileRemove = async (documentId: string) => {
    const fileData = uploadedFiles[documentId]
    if (!fileData) return

    try {
      if (fileData.publicId) {
        const result = await deleteFile(fileData.publicId)

        if (!result.success) {
          showErrorToast(result.error || "Error: Failed to delete document from server")
          return
        }
      }

      const newFiles = { ...uploadedFiles }
      delete newFiles[documentId]
      setUploadedFiles(newFiles)

      updateFormData(
        "uploadedDocuments",
        formData.uploadedDocuments.filter((doc: any) => doc.name !== documentId),
      )

      showInfoToast("Success", "Document removed successfully")
    } catch (error) {
      console.error("Remove error:", error)
      showErrorToast("Error: Failed to remove document")
    }
  }

  const getUploadStatus = (documentId: string) => {
    const fileData = uploadedFiles[documentId]
    if (!fileData) return "pending"
    if (fileData.uploading) return "uploading"
    return "uploaded"
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {requiredDocuments.map((doc, index) => {
          const status = getUploadStatus(doc.id)
          const fileData = uploadedFiles[doc.id]
          const isUploading = uploadProgress[doc.id]

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {doc.required && (
                <div className="absolute -top-3 left-4 z-10">
                  <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-md">
                    Required
                  </span>
                </div>
              )}

              <Card className="p-4 h-full flex flex-col items-center justify-between text-center space-y-4 rounded-xl shadow-none border-2 bg-gray-100 border-gray-200">
                <h3 className="font-semibold text-foreground text-lg pt-2">{doc.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{doc.description}</p>

                {status === "pending" ? (
                  <div className="w-full space-y-4">
                    <div className="flex flex-col items-center space-y-3">
                      <Icon icon="material-symbols:upload" className="w-8 h-8 text-primary" />
                      <Label htmlFor={`file-${doc.id}`} className="sr-only">
                        Upload {doc.title}
                      </Label>
                      <Input
                        id={`file-${doc.id}`}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(doc.id, file)
                          }
                        }}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        onClick={() => document.getElementById(`file-${doc.id}`)?.click()}
                        className="bg-primary hover:bg-primary/90 text-white px-8 h-11 rounded-xl"
                        disabled={isUploading}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                ) : status === "uploading" ? (
                  <div className="w-full flex items-center justify-center bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <span className="text-sm text-primary font-medium">Uploading...</span>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <Icon icon="lets-icons:check-fill" className="w-5 h-5 text-green-600 shrink-0" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300 truncate max-w-3/5 w-full relative">
                        {fileData?.file?.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileRemove(doc.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-100 p-2 h-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>

      <p className="text-sm text-muted-foreground text-left">Accepted formats: PDF, JPG, PNG (max 5MB)</p>
      <div className="space-y-2">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
          <div className="flex items-start space-x-3">
            <Icon icon="material-symbols:info-outline-rounded" className="w-8 h-8 text-primary" />
            <div className="space-y-1 text-left">
              <p className="text-sm font-semibold text-foreground">Document Verification Process</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All documents will be securely reviewed by our verification team. This process typically takes 1-3
                business days. You'll receive an email notification once your credentials are verified.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
          <div className="flex items-start space-x-3">
            <Icon icon="material-symbols:info-outline-rounded" className="w-8 h-8 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Data Security & Privacy</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your documents are encrypted and stored securely. We only use them for verification purposes and comply
                with all healthcare data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

DocumentUploadStep.displayName = "DocumentUploadStep"
