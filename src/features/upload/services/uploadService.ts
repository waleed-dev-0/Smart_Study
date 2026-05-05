import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const uploadFile = async (file: File, parentId?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (parentId) {
    formData.append('parentId', parentId);
  }

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload file');
  }
};

export const fetchDocuments = async () => {
  try {
    const response = await axios.get(`${API_URL}/documents`);
    return response.data;
  } catch (error: any) {
    console.error('Fetch documents error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch documents');
  }
};
