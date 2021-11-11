import { useContext, useEffect } from 'react'

// Contexto
import { AppContext } from 'context/AppContext'

// Dependencias
import PropTypes from 'prop-types'

// Servicios
import { fetchListOfSubjects } from '../../firebase/client'

// Componentes
import Menu from 'components/Menu'
import Header from 'components/Header'

import './styles.css'

const MainLayout = ({ children }) => {
    /* -------------------------------------------------------------------- */
    /* -------------------- CONSTANTES Y DECLARACIONES -------------------- */
    /* -------------------------------------------------------------------- */
    const { user, setListOfSubjects } = useContext(AppContext)

    /* -------------------------------------------------------------------- */
    /* ---------------------------- USE EFFECTS --------------------------- */
    /* -------------------------------------------------------------------- */
    useEffect(async () => {
        const { id: userId } = user
        const subjects = await fetchListOfSubjects(userId)

        setListOfSubjects(subjects)
    }, [])

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <div className='wrapper'>
            <Header />
            <Menu />
            <main className='main'>{children}</main>
        </div>
    )
}

export default MainLayout

MainLayout.propTypes = {
    children: PropTypes.node,
}
