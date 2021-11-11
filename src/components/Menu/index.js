import { useContext, useState } from 'react'

// Dependencias
import { useHistory } from 'react-router-dom'

// Contexto
import { AppContext } from 'context/AppContext'

// Servicios
import { deleteSubject } from '../../firebase/client'

// Componentes
import SubjectItem from '../SubjectItem'
import Alert from 'components/Alert'

import './styles.css'

const Menu = () => {
    /* -------------------------------------------------------------------- */
    /* -------------------- CONSTANTES Y DECLARACIONES -------------------- */
    /* -------------------------------------------------------------------- */
    const { listOfSubjects, setCurrentSubject, setListOfSubjects } =
        useContext(AppContext)
    const history = useHistory()
    const [alert, setAlert] = useState(null)

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const handleNew = () => {
        setCurrentSubject(null)
        history.push('/subject')
    }

    const deleteSelectedSubject = async subjectId => {
        try {
            await deleteSubject(subjectId)
            setListOfSubjects(
                listOfSubjects.filter(element => element.id !== subjectId)
            )
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Error al eliminar la asignatura',
            })
        }
    }

    /* -------------------------------------------------------------------- */
    /* ---------------------------- USE EFFECTS --------------------------- */
    /* -------------------------------------------------------------------- */

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <nav className='nav'>
            <div className='alert-box'>
                {alert && <Alert type={alert.type} message={alert.message} />}
            </div>
            <ul className='main-menu'>
                {listOfSubjects &&
                    listOfSubjects.length > 0 &&
                    listOfSubjects.map(subject => (
                        <SubjectItem
                            subject={subject}
                            deleteSelectedSubject={deleteSelectedSubject}
                            key={subject.id}
                        />
                    ))}
            </ul>

            <button className='new-subject'>
                <i className='far fa-plus-square fa-2x' onClick={handleNew}></i>
            </button>
        </nav>
    )
}

export default Menu
