import { useState, useContext } from 'react'

// Dependencias
import { Link, useHistory } from 'react-router-dom'
import { signInByEmail, signInWithGoogle } from '../../firebase/client'

// Contexto
import { AppContext } from 'context/AppContext'

// Componentes
import { GoogleLogo } from 'components/Icons'
import Alert from 'components/Alert'

import './styles.css'

const Login = () => {
    /* -------------------------------------------------------------------- */
    /* --------------------- CONSTANTES Y DECLARACIONES ------------------- */
    /* -------------------------------------------------------------------- */
    const [inputData, setInputData] = useState({
        email: '',
        password: '',
    })
    const { email, password } = inputData
    const [error, setError] = useState(null)
    const { setUser } = useContext(AppContext)
    const history = useHistory()

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const handleSubmit = async e => {
        e.preventDefault()

        if (!email || email === '' || !password || password === '') {
            setError('Los campos son obligatorios')
            return
        }

        setError('')

        try {
            const user = await signInByEmail(inputData)

            if (!handleError(user)) return

            const { displayName, uid } = user

            setUser({ name: displayName, id: uid })

            history.push('/main')
        } catch (error) {
            console.log('Error al iniciar sesión')
            setError('Error al iniciar sesión')
        }
    }

    const handleError = errorCode => {
        setError(null)

        if (errorCode === 'auth/invalid-email') {
            setError('La cuenta de correo no es válida')
            return false
        } else if (errorCode === 'auth/user-not-found') {
            setError('La cuenta de correo no existe')
            return false
        } else if (errorCode === 'auth/wrong-password') {
            setError('Contraseña incorrecta')
            return false
        } else if (errorCode === 'auth/operation-not-allowed') {
            setError('Error al iniciar sesión')
            return false
        } else {
            return true
        }
    }

    const handleChange = e => {
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value,
        })
    }

    const handleLoginWithGoogle = async () => {
        try {
            const user = await signInWithGoogle()
            const { name, uid } = user

            setUser({ name, id: uid })

            history.push('/main')
        } catch (error) {
            console.log('error login google', error)
            setError('Error al iniciar sesión con Google')
        }
    }

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <div className='card login-container'>
            <h1 className='form__title'>Inicio de Sesión</h1>
            {error && <Alert type='error' message={error} />}
            <form className='login-form' onSubmit={handleSubmit}>
                <input
                    autoFocus
                    className='input login-form__input'
                    type='email'
                    name='email'
                    value={email}
                    placeholder='Introduce el e-mail'
                    onChange={handleChange}
                />
                <input
                    className='input login-form__input'
                    type='password'
                    name='password'
                    value={password}
                    placeholder='Introduce la contraseña'
                    onChange={handleChange}
                />

                <div className='login-form__buttons'>
                    <button className='btn' type='submit'>
                        Iniciar Sesión
                    </button>
                    <button
                        className='login-form__google-btn'
                        type='button'
                        onClick={handleLoginWithGoogle}
                    >
                        <GoogleLogo /> Continuar con Google
                    </button>
                </div>
                <Link to='/new-account' className='login-link'>
                    ¿No tienes cuenta? ¡Regístrate!
                </Link>
            </form>
        </div>
    )
}

export default Login
