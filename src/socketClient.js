// Cấu hình Socket-io phía client tại đây và export ra biến socketIoInstance
// https://socket.io/how-to/use-with-react
import { io } from 'socket.io-client'
import { API_ROOT } from '~/utils/constants'
// Trên Vercel production, API_ROOT=' /api ' sẽ làm Socket.io nhầm tưởng là namespace
// Nên ta phải truyền nguyên URL hiện tại (window.location.origin) để nó gọi đúng vào /socket.io
export const socketIoInstance = io(import.meta.env.PROD ? window.location.origin : API_ROOT)