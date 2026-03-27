// Cấu hình Socket-io phía client tại đây và export ra biến socketIoInstance
// https://socket.io/how-to/use-with-react
import { io } from 'socket.io-client'
// Vercel không hỗ trợ Proxy (Rewrite) cho WebSockets, nên riêng thằng Socket.io này bắt buộc phải trỏ thẳng về domain gốc của Backend (Render).
const socketURL = import.meta.env.PROD 
  ? 'https://trello-api-h1dj.onrender.com'
  : 'http://localhost:8017'

export const socketIoInstance = io(socketURL)