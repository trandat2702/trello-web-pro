
import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { toast } from 'react-toastify'

//Board Details API
//Đã xử lí ở Redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   // lưu ý :axios trả về kết quả trong thuộc tính data
//   return response.data
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  // lưu ý :axios trả về kết quả trong thuộc tính data
  return response.data
}

export const moveCardBetweenDifferentColumnsAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  // lưu ý :axios trả về kết quả trong thuộc tính data
  return response.data
}
//Column Details API
export const createNewColumnAPI = async (newcolumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newcolumnData)
  return response.data
}
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  // lưu ý :axios trả về kết quả trong thuộc tính data
  return response.data
}
export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  // lưu ý :axios trả về kết quả trong thuộc tính data
  return response.data
}
//Card Details API
export const createNewCardAPI = async (newcardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newcardData)
  return response.data
}

/** Users */
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our services! Have a good day!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}