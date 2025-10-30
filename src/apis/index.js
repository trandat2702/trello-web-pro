import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

//Board Details API
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // lưu ý :axios trả về kết quả trong thuộc tính data
  return response.data
}

//Column Details API
export const createNewColumnAPI = async (newcolumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newcolumnData)
  return response.data
}

//Card Details API
export const createNewCardAPI = async (newcardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newcardData)
  return response.data
}