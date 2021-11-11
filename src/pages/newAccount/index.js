import { useState, useContext } from 'react'

// Dependencias
import { useHistory, Link } from 'react-router-dom'
import { signUpByEmail } from '../../firebase/client'

// Contexto
import { AppContext } from 'context/AppContext'

// Componentes
import Alert from 'components/Alert'

import './styles.css'

const NewAccount = () => {
    /* -------------------------------------------------------------------- */
    /* --------------------- CONSTANTES Y DECLARACIONES ------------------- */
    /* -------------------------------------------------------------------- */
    const [inputData, setInputData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const { name, email, password, confirmPassword } = inputData
    const [error, setError] = useState(null)
    const { setUser } = useContext(AppContext)
    const history = useHistory()

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const signUp = async () => {
        const user = await signUpByEmail(inputData)

        if (handleError(user)) return

        const { displayName, uid } = user
        setUser({ name: displayName, id: uid })

        history.push('/main')
    }

    const handleError = errorCode => {
        if (errorCode === 'auth/email-already-in-use') {
            setError('La cuenta de correo ya existe.')
            return true
        } else {
            return false
        }
    }

    const handleSubmit = e => {
        e.preventDefault()

        if (
            !name ||
            name === '' ||
            !email ||
            email === '' ||
            !password ||
            password === '' ||
            !confirmPassword ||
            confirmPassword === ''
        ) {
            setError('Todos los campos son obligatorios')
            return
        }

        if (password.length < 6) {
            setError('La contraseña debe tener un mínimo de 6 caracteres')
            return
        }

        if (!confirmPassword || confirmPassword === '') {
            setError('Introduce la confirmación de la contraseña')
            return
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas deben coincidir')
            return
        }

        setError('')
        signUp()
    }

    const handleChange = e => {
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value,
        })
    }

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <>
            <div className='card new-account-container'>
                <h1 className='form__title'>Crear Nueva Cuenta</h1>
                <form className='new-account-form' onSubmit={handleSubmit}>
                    {error && <Alert type='error' message={error} />}
                    <input
                        className='input new-account-form__input'
                        autoFocus
                        type='text'
                        name='name'
                        placeholder='Introduce un nombre'
                        onChange={handleChange}
                    />
                    <input
                        className='input new-account-form__input'
                        type='email'
                        name='email'
                        placeholder='Introduce una cuenta de correo.'
                        onChange={handleChange}
                    />
                    <input
                        className='input new-account-form__input'
                        type='password'
                        name='password'
                        placeholder='Introduce la contraseña'
                        onChange={handleChange}
                    />
                    <input
                        className='input new-account-form__input'
                        type='password'
                        name='confirmPassword'
                        placeholder='Confirma la contraseña'
                        onChange={handleChange}
                    />
                    <button className='btn new-account-form__btn' type='submit'>
                        Registrarse
                    </button>
                    <Link to='/login' className='new-account-link'>
                        ¿Ya tienes una cuenta? ¡Inicia sesión!
                    </Link>
                </form>
            </div>
        </>
    )
}

export default NewAccount
