import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

//Board Details API
//Đã xử lí ở Redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   // lưu ý :axios trả về kết quả trong thuộc tính data
//   return response.data
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  // lưu ý :axios trả về kết quả trong thuộc tính data
  return response.data
}

export const moveCardBetweenDifferentColumnsAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  // lưu ý :axios trả về kết quả trong thuộc tính data
  return response.data
}
//Column Details API
export const createNewColumnAPI = async (newcolumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newcolumnData)
  return response.data
}
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  // lưu ý :axios trả về kết quả trong thuộc tính data
  return response.data
}
export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  // lưu ý :axios trả về kết quả trong thuộc tính data
  return response.data
}
//Card Details API
export const createNewCardAPI = async (newcardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newcardData)
  return response.data
}