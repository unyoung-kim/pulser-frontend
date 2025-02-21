export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pulser-backend.onrender.com';
export const LOCAL_BACKEND_URL = 'http://localhost:8000';

// VisualModal api urls
export const visualList = `${BACKEND_URL}/text-to-visual`;

// Background Details api urls
export const internalLinksUrl = `${BACKEND_URL}/api/internal-links-handler`;
export const autofillBackgroundUrl = `${BACKEND_URL}/autofill-background`;

// Content api urls
export const generateTopic = `${BACKEND_URL}/api/generate-topic`;
export const webRetrieval = `${BACKEND_URL}/api/web-retrieval`;
export const generateListicle = `${LOCAL_BACKEND_URL}/api/generate-listicles`;

// Keyword api urls
export const keywordApiUrl = `${BACKEND_URL}/semrush-keyword-broad-match-and-overview`;

// Editor api urls
export const youtubeSearch = `${BACKEND_URL}/api/video-search`;
export const imageSearch = `${BACKEND_URL}/api/image-search`;

// Settings api urls
export const createSubscriptionUrl = `${BACKEND_URL}/api/create-stripe-session`;
export const deleteSubscriptionUrl = `${BACKEND_URL}/api/delete-subscription`;
export const updateSubscriptionUrl = `${BACKEND_URL}/api/update-subscription`;
