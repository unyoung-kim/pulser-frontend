export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pulser-backend.onrender.com';
export const LOCAL_BACKEND_URL = 'http://localhost:8000';

// VisualModal api urls
export const visualList = `${BACKEND_URL}/text-to-visual`;

// Background Details api urls
export const internalLinksUrl = `${BACKEND_URL}/api/internal-links-handler`;

// Content api urls
export const generateTopic = `${BACKEND_URL}/api/generate-topic`;
export const webRetrieval = `${BACKEND_URL}/api/web-retrieval`;

// Editor api urls
export const youtubeSearch = `${BACKEND_URL}/api/video-search`;
