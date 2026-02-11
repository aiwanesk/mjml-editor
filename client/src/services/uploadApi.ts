import { api } from "./api";

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.upload<{ url: string }>("/upload", formData);
  },
};
