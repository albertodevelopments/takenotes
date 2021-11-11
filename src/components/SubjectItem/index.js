import { useContext } from 'react'

// Dependencias
import PropTypes from 'prop-types'

// Contexto
import { AppContext } from 'context/AppContext'

// Dependencias
import { useHistory } from 'react-router-dom'

const SubjectItem = ({ subject, deleteSelectedSubject }) => {
    /* -------------------------------------------------------------------- */
    /* -------------------- CONSTANTES Y DECLARACIONES -------------------- */
    /* -------------------------------------------------------------------- */
    const { setCurrentSubject } = useContext(AppContext)
    const history = useHistory()

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const handleOpenSubject = () => {
        setCurrentSubject(subject)

        history.push('/topics')
    }

    const handleEditSubject = () => {
        setCurrentSubject(subject)

        history.push('/subject')
    }

    const handleDeleteSubject = () => {
        setCurrentSubject(null)
        const { id: subjectId } = subject

        deleteSelectedSubject(subjectId)
    }

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <li className='main-menu__item'>
            <span className='nav-link'>
                <i className='far fa-edit' onClick={handleEditSubject}></i>
                <i className='fas fa-trash' onClick={handleDeleteSubject}></i>
                <span onClick={handleOpenSubject}>
                    {subject && subject.name}
                </span>
            </span>
        </li>
    )
}

export default SubjectItem

SubjectItem.propTypes = {
    subject: PropTypes.object.isRequired,
    deleteSelectedSubject: PropTypes.func.isRequired,
}
