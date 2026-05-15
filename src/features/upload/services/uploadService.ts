import api from "../../../services/api";

export const uploadFile = async (file: File, parentId?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (parentId) {
    formData.append('parentId', parentId);
  }

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
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
