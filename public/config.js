// Runtime config cho Docker - CHỈ ghi đè khi Docker inject giá trị thực
// Khi deploy lên Vercel, file này KHÔNG nên set giá trị
// vì nó sẽ override URL production trong constants.js
window.env = {};
