import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import { toast } from 'react-toastify'
import { loginWithGoogleAPI } from '~/redux/user/userSlice'
import { GOOGLE_CLIENT_ID } from '~/utils/constants'

function GoogleLoginButton() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!window.google) return

    // Xử lý response từ Google
    const handleLogin = async (response) => {
      if (!response.credential) return

      try {
        const result = await dispatch(loginWithGoogleAPI({
          googleToken: response.credential
        }))

        if (result.error) {
          toast.error(result.error.message || 'Đăng nhập thất bại')
        } else {
          toast.success('Đăng nhập thành công!')
          navigate('/')
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi đăng nhập với Google')
      }
    }

    // Khởi tạo Google Sign-In
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleLogin
    })

    // Render button
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        locale: 'vi'
      }
    )
  }, [dispatch, navigate])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <div id="google-signin-button" style={{ width: '100%' }}></div>
    </Box>
  )
}

export default GoogleLoginButton