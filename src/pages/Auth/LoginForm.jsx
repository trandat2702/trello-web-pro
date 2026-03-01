
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
// import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import GoogleLoginButton from '~/pages/Auth/GoogleLoginButton'
import Divider from '@mui/material/Divider'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'

function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')
  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(dispatch(loginUserAPI({ email, password })), {
      pending: 'Logging in your account...'
    }).then(res => {
      //console.log('Login successful, redirecting to home page...', res)
      //Đoạn này phải kiểm tra không có lỗi (login thành công) thì mới điều hướng về /
      if (!res.error) {
        navigate('/')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{
          minWidth: 380,
          maxWidth: 420,
          marginTop: '0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          backgroundColor: theme => theme.palette.mode === 'dark'
            ? 'rgba(30, 30, 30, 0.95)'
            : 'rgba(255, 255, 255, 0.95)'
        }}>
          {/* Header */}
          <Box sx={{
            padding: '2em 2em 1em 2em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5
          }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <LockIcon />
              </Avatar>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <TrelloIcon />
              </Avatar>
            </Box>
            <Typography variant="h5" fontWeight="600" color="text.primary">
              Đăng Nhập
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Author: QuocDatDev
            </Typography>
          </Box>

          {/* Alerts */}
          {(verifiedEmail || registeredEmail) && (
            <Box sx={{ padding: '0 2em', mb: 2 }}>
              {verifiedEmail && (
                <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  Your email&nbsp;
                  <Typography component="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
                    {verifiedEmail}
                  </Typography>
                  &nbsp;has been verified.<br />Now you can login to enjoy our services!
                </Alert>
              )}

              {registeredEmail && (
                <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  An email has been sent to&nbsp;
                  <Typography component="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
                    {registeredEmail}
                  </Typography>
                  <br />Please check and verify your account before logging in!
                </Alert>
              )}
            </Box>
          )}


          {/* Email/Password Form */}
          <Box sx={{ padding: '1em 2em 2em 2em' }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="text"
                variant="outlined"
                error={!!errors['email']}
                size="medium"
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>

            <Box sx={{ mb: 2.5 }}>
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                variant="outlined"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'} />
            </Box>

            <Button
              className='interceptor-loading'
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(25,118,210,0.25)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(25,118,210,0.35)'
                }
              }}
            >
              Đăng nhập
            </Button>
          </Box>
          {/* Divider */}
          <Box sx={{ padding: '0 2em' }}>
            <Divider sx={{ my: 1.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                HOẶC
              </Typography>
            </Divider>
          </Box>
          {/* Google Login Button */}
          <Box sx={{ padding: '0 2em 1em 2em' }}>
            <GoogleLoginButton />
          </Box>


          {/* Footer */}
          <Box sx={{
            padding: '1.5em 2em 2em 2em',
            textAlign: 'center',
            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Bạn chưa có tài khoản?
            </Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#ffbb39',
                    textDecoration: 'underline'
                  }
                }}
              >
                Đăng ký ngay
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm
