import { useContext, useState, useEffect, useRef } from 'react'

// Contexto
import { AppContext } from 'context/AppContext'

// Servicios
import { createNewSubject, updateSubject } from '../../firebase/client'

// Dependencias
import { useHistory } from 'react-router-dom'

// Componentes
import MainLayout from 'components/MainLayout'
import Alert from 'components/Alert'

import { orderListByName } from 'util'
import './styles.css'

const Subject = () => {
    /* -------------------------------------------------------------------- */
    /* --------------------- CONSTANTES Y DECLARACIONES ------------------- */
    /* -------------------------------------------------------------------- */
    const [inputData, setInputData] = useState({
        userId: '',
        id: '',
        name: '',
    })
    const { name } = inputData
    const { user, currentSubject, listOfSubjects, setListOfSubjects } =
        useContext(AppContext)
    const nameRef = useRef()
    const [alert, setAlert] = useState(null)
    const history = useHistory()

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const isEmptySubject = subjectToCheck => {
        if (!subjectToCheck) return true

        const { name } = subjectToCheck

        if (name === '') return true

        return false
    }

    const update = async subject => {
        try {
            await updateSubject(subject)
            history.push('/main')
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Error al modificar el nombre de asignatura',
            })
        }
    }

    const createSubject = async subject => {
        try {
            const createdSubject = await createNewSubject(subject)
            setListOfSubjects(
                [...listOfSubjects, createdSubject].sort(orderListByName)
            )
            history.push('/main')
        } catch (error) {
            console.log(error)
            setAlert({
                type: 'error',
                message: 'Error al crear la nueva asignatura',
            })
        }
    }

    const handleSubmit = e => {
        e.preventDefault()

        // Manejo de errores
        if (!name || name === '') {
            setAlert({
                type: 'error',
                message: 'El nombre de la asignatura es obligatorio',
            })
            return
        }

        if (!isEmptySubject(currentSubject)) {
            const subject = {
                ...currentSubject,
                name,
            }
            update(subject)
        } else {
            const subject = {
                name,
                userId: user.id,
            }
            createSubject(subject)
        }
    }

    const handleChange = e => {
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value,
        })
    }

    /* -------------------------------------------------------------------- */
    /* ---------------------------- USE EFFECTS --------------------------- */
    /* -------------------------------------------------------------------- */
    useEffect(() => {
        if (currentSubject) {
            setInputData({
                userId: user.id,
                id: currentSubject.id,
                name: currentSubject.name,
            })
        } else {
            setInputData({
                ...inputData,
                id: '',
                name: '',
            })
        }
        nameRef.current.focus()
    }, [currentSubject])

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <MainLayout>
            <div className='card subject__container'>
                <form className='subject__form' onSubmit={handleSubmit}>
                    <h1 className='form__title'>
                        Crea o modifica la Asignatura
                    </h1>
                    {alert && (
                        <Alert type={alert.type} message={alert.message} />
                    )}
                    <input
                        type='text'
                        name='name'
                        value={name}
                        ref={nameRef}
                        className='input subject__input'
                        placeholder='Introduce el nombre de la asignatura'
                        onChange={handleChange}
                    />
                    <button className='btn subject__btn' type='submit'>
                        Guardar
                    </button>
                </form>
            </div>
        </MainLayout>
    )
}

export default Subject
