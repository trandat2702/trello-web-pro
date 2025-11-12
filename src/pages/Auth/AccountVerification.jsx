import { useSearchParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
function AccountVerification() {
  //lấy giá trị email và token từ query parameters (URL)
  let [searchParams] = useSearchParams()
  //const email = searchParams.get('email')
  //const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])

  // Tạo 1 biến state để biết được là đã verify thành công hay chưa
  const [Verified, setVerified] = useState(false)

  //Gọi API verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token })
        .then(() => {
          setVerified(true)
        })
    }
  }, [email, token])
  //Nếu url có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì đá ra trang 404 luôn
  if (!email || !token) {
    return <Navigate to="/404" />
  }
  //Nếu chưa verify xong thì hiện thị loading
  if (!Verified) {
    return <PageLoadingSpinner caption="Verifying Account..." />
  }
  //Cuối cùng nếu không gặp vấn đề gì + verify thành công thì điều hướng trang login cùng giá trị với verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification