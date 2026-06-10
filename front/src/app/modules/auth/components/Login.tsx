import {useState, useRef, useEffect} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {useFormik} from 'formik'
import {login} from '../core/_requests'
import {useAuth} from '../core/Auth'

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .email('Format d\'email incorrect')
    .min(3, 'Minimum 3 caractères')
    .max(50, 'Maximum 50 caractères')
    .required('L\'email est requis'),
  password: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .max(50, 'Maximum 50 caractères')
    .required('Le mot de passe est requis'),
})

const initialValues = {
  username: '',
  password: '',
}

const DEMO_ACCOUNTS = [
  {role: 'Direction',                email: 'admin@athena.mg',      password: 'Admin@1234'},
  {role: 'Bureau d\'Etude Technique', email: 'bet@athena.mg',        password: 'Bet@1234'},
  {role: 'Responsable de Production', email: 'rp@athena.mg',         password: 'Rp@1234'},
  {role: 'Technicien',               email: 'technicien@athena.mg',  password: 'Tech@1234'},
  {role: 'Ouvrier Spécialisé',       email: 'os@athena.mg',          password: 'Os@1234'},
  {role: 'Manoeuvre',                email: 'manoeuvre@athena.mg',   password: 'Man@1234'},
]

export function Login() {
  const [loading, setLoading] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const {saveAuth} = useAuth()
  const demoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setShowDemo(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const auth = await login(values.username, values.password)
        saveAuth(auth)
      } catch (error) {
        saveAuth(undefined)
        setStatus('Les informations de connexion sont incorrectes')
        setSubmitting(false)
      }
      setLoading(false)
    },
  })

  const fillDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
    formik.setFieldValue('username', account.email)
    formik.setFieldValue('password', account.password)
    setShowDemo(false)
  }

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <div className='text-center mb-11'>
        <h1 className='text-gray-900 fw-bolder mb-3'>Se connecter</h1>
      </div>

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      <div className='fv-row mb-8' ref={demoRef} style={{position: 'relative'}}>
        <label className='form-label fs-6 fw-bolder text-gray-900'>Email</label>
        <input
          placeholder='Email'
          {...formik.getFieldProps('username')}
          onFocus={() => setShowDemo(true)}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.username && formik.errors.username},
            {'is-valid': formik.touched.username && !formik.errors.username}
          )}
          type='email'
          name='username'
          autoComplete='off'
        />
        {formik.touched.username && formik.errors.username && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.username}</span>
          </div>
        )}

        {showDemo && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 9999,
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              marginTop: '4px',
              overflow: 'hidden',
            }}
          >
            <div style={{padding: '8px 12px', fontSize: '11px', color: '#888', borderBottom: '1px solid #f0f0f0', fontWeight: 600, letterSpacing: '0.5px'}}>
              COMPTES DÉMO
            </div>
            {DEMO_ACCOUNTS.map((account) => (
              <div
                key={account.email}
                onMouseDown={() => fillDemo(account)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #f5f5f5',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8f9fa')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{fontWeight: 600, fontSize: '13px', color: '#1a1a2e'}}>{account.role}</span>
                <span style={{fontSize: '12px', color: '#888'}}>{account.email}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='fv-row mb-3' style={{position: 'relative'}}>
        <label className='form-label fw-bolder text-gray-900 fs-6 mb-0'>Mot de passe</label>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          onFocus={() => setShowDemo(true)}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.password && formik.errors.password},
            {'is-valid': formik.touched.password && !formik.errors.password}
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>

      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continuer</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Patienter...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
    </form>
  )
}
