import { useContext } from 'react'

// Dependencias
import { useHistory } from 'react-router-dom'

// Contexto
import { AppContext } from 'context/AppContext'

// Servicios
import { logOut } from '../../firebase/client'

import './styles.css'

const Header = () => {
    /* -------------------------------------------------------------------- */
    /* --------------------- CONSTANTES Y DECLARACIONES ------------------- */
    /* -------------------------------------------------------------------- */
    const { user } = useContext(AppContext)
    const history = useHistory()

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const handleLogOut = async () => {
        try {
            await logOut()
            history.push('/login')
        } catch (error) {
            console.log('Error al cerrar sesión')
        }
    }

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <header className='header'>
            <div className='logo'>
                <span className='logo-big logo-yellow'>M</span>
                <span className='logo-small logo-white'>is</span>
                <span className='logo-big logo-white'>A</span>
                <span className='logo-small logo-white'>puntes</span>
            </div>
            <div className='user'>
                {user && user.name}
                <i
                    className='fas fa-door-open logout-icon'
                    onClick={handleLogOut}
                ></i>
            </div>
        </header>
    )
}

export default Header
