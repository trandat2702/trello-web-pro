// Mặc định là production URL (an toàn khi deploy lên Vercel/Render)
let apiRoot = 'https://trello-api-h1dj.onrender.com'

// Chỉ khi nào BUILD_MODE là 'dev' mới dùng localhost
if (process.env.VITE_BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

// --- QUAN TRỌNG: Cấu hình cho Docker (Runtime Config) ---
// Nếu chạy qua Docker (có file config.js), ưu tiên lấy giá trị từ window.env
// Điều này giúp ghi đè giá trị ngay cả khi đã build xong.
if (window.env?.VITE_API_ROOT) {
  apiRoot = window.env.VITE_API_ROOT
}

export const API_ROOT = apiRoot

// Lấy Google Client ID (ưu tiên Runtime -> Env -> Hardcode)
let googleClientId = process.env.VITE_GOOGLE_CLIENT_ID || ''
if (window.env?.VITE_GOOGLE_CLIENT_ID) {
  googleClientId = window.env.VITE_GOOGLE_CLIENT_ID
}
export const GOOGLE_CLIENT_ID = googleClientId

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}
