import { FILE_UPLOAD } from '@/utils/constants';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

interface UploadOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: string;
  tags?: string[];
}

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

  const uploadFile = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> => {
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    if (file.size > FILE_UPLOAD.MAX_SIZE) {
      return {
        success: false,
        error: 'File size exceeds 10MB limit'
      };
    }

    if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type as any)) {
      return {
        success: false,
        error: 'File type not supported. Please upload PDF, DOC, DOCX, JPG, PNG, or WEBP files.'
      };
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.resourceType) {
        formData.append('resource_type', options.resourceType);
      } else {
        if (file.type.startsWith('image/')) {
          formData.append('resource_type', 'image');
        } else {
          formData.append('resource_type', 'raw');
        }
      }
      
      if (options.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
      }
      
      if (options.transformation) {
        formData.append('transformation', options.transformation);
      }

      if (CLOUDINARY_API_KEY) {
        const timestamp = Math.round(Date.now() / 1000);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', CLOUDINARY_API_KEY);
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.data;
      
      setProgress(100);
      
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id
      };

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred during upload';
      
      toast.error('Upload Failed', {
        description: errorMessage
      });
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadMultipleFiles = async (
    files: File[],
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> => {
    const results: CloudinaryUploadResult[] = [];
    
    for (const file of files) {
      const result = await uploadFile(file, options);
      results.push(result);
    }
    
    return results;
  };

  const deleteFile = async (publicId: string): Promise<{ success: boolean; error?: string }> => {
    try {
       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cloudinary/delete`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
        data: { publicId },
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    uploading,
    progress
  };
};

export default useCloudinaryUpload;