import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
//Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()
//Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000
//withCredentials: Sẽ cho phép axios tự động gửi lên cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh token và access token) trong HttpOnly cookies của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true
//Cấu hình Interceptor (Bộ đánh chặn vào giữa mọi request và response của axios)
//https://axios-http.com/docs/interceptors
// Interceptor Request: Can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use((config) => {
  //Kỹ thuật chặn spam click
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
},
  { synchronous: true, runWhen: () => true }
)

// Interceptor Response: Can thiệp vào giữa những cái response API
authorizedAxiosInstance.interceptors.response.use((response) => {
  //Kỹ thuật chặn spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Mọi mã http status code nằm ngoài khoảng 200-299 sẽ là error và rơi vào đây

  //Kỹ thuật chặn spam click
  interceptorLoadingElements(false)

  //Xử lý lỗi tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một lần: Clean Code)
  //console.log error ra là sẽ thấy cấu trúc data dẫn đến message lỗi như dưới đây
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error?.response.data?.message
  }
  //Dùng toastify để hiện thị bất kể mọi mã lỗi lên màn hình - ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance