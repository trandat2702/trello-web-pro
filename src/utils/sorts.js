/**
 * ---
 * Order an array of objects based on another array & return new Ordered Array
 * The original array will not be modified.
 * ---
 * @param {*} originalArray
 * @param {*} orderArray
 * @param {*} key = Key to order
 * @return new Ordered Array
 * Xác định các phần tử trong array gốc ban đầu (originalArray) xem nó nằm ở đâu trong array thứ 2 (orderArray) (là array mà mình dùng để sắp xếp) bằng cách tìm index (indexOf) rồi sẽ sắp xếp theo index đó bằng hàm sort của Javascript.
 */


export const mapOrder = (originalArray, orderArray, key) => {
  if (!originalArray || !orderArray || !key) return []

  const clonedArray = [...originalArray]
  const orderedArray = clonedArray.sort((a, b) => {
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
  })

  return orderedArray
}
// const tasks = [
//   { id: 'task1', name: 'Thiết kế UI' },
//   { id: 'task2', name: 'Lập trình Backend' },
//   { id: 'task3', name: 'Viết tài liệu' }
// ]

// const order = ['task2', 'task1', 'task3']
// Bước 1: Gọi mapOrder(tasks, order, 'id')

// a = {id: 'task1'}, b = {id: 'task2'}

// Bước 2: Tính index

// order.indexOf('task1') = 1

// order.indexOf('task2') = 0

// Bước 3: So sánh
// 1 - 0 = 1 (số dương) → b (task2) sẽ đứng trước a (task1)

// Bước 4: Lặp lại với các phần tử khác

// Cuối cùng sẽ có thứ tự:
// task2 → task1 → task3

