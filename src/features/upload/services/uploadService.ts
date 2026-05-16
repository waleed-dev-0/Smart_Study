import api from "../../../services/api";

export class UploadError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "UploadError";
    this.status = status;
  }
}

export const uploadFile = async (file: File, parentId?: string, force = false) => {
  const formData = new FormData();
  formData.append('file', file);
  if (parentId) {
    formData.append('parentId', parentId);
  }
  if (force) {
    formData.append('force', 'true');
  }

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Upload error:', error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to upload file';
    throw new UploadError(message, status);
  }
};

export const fetchDocuments = async () => {
  try {
    const response = await api.get('/documents');
    return response.data;
  } catch (error: any) {
    console.error('Fetch documents error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch documents');
  }
};