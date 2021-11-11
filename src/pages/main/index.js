// Dependencias
import { NavLink } from 'react-router-dom'

// Componentes
import MainLayout from 'components/MainLayout'

const Main = () => {
    /* -------------------------------------------------------------------- */
    /* --------------------- CONSTANTES Y DECLARACIONES ------------------- */
    /* -------------------------------------------------------------------- */

    /* -------------------------------------------------------------------- */
    /* ---------------------------- USE EFFECTS --------------------------- */
    /* -------------------------------------------------------------------- */

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <MainLayout>
            <h1 className='main__h1 display-1'>Aplicación de Apuntes</h1>
            <h3 className='main__h3 display-3'>
                Selecciona una asignatura del menú lateral o crea una{' '}
                <NavLink
                    className='main__nav-link'
                    to='/subject'
                    exact
                    activeClassName='active'
                >
                    nueva
                </NavLink>
            </h3>
        </MainLayout>
    )
}

export default Main
