import { BASE_URL } from "../api/axios";

export const getPhotoUrl = (path) => {
  if (!path) return "https://placehold.co/600x400";
  
  // If it's already a full URL (Cloudinary, etc.), return it
  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }

  // Handle local uploads (legacy data)
  // Replace backslashes with forward slashes for URL compatibility
  const normalizedPath = path.replace(/\\/g, "/");
  
  // Ensure we don't double slash if path starts with /
  const cleanPath = normalizedPath.startsWith("/") ? normalizedPath.slice(1) : normalizedPath;

  return `${BASE_URL}/${cleanPath}`;
};
