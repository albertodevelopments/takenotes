import { useContext, useState, useEffect, useRef } from 'react'

// Contexto
import { AppContext } from 'context/AppContext'

// Servicios
import { createNewTopic, updateTopic } from '../../firebase/client'

// Dependencias
import { useHistory } from 'react-router-dom'

// Componentes
import MainLayout from 'components/MainLayout'
import Alert from 'components/Alert'

import { orderListByName } from 'util'
import './styles.css'

const Topic = () => {
    /* -------------------------------------------------------------------- */
    /* --------------------- CONSTANTES Y DECLARACIONES ------------------- */
    /* -------------------------------------------------------------------- */
    const [inputData, setInputData] = useState({
        subjectId: '',
        id: '',
        description: '',
    })
    const { description } = inputData
    const { currentSubject, currentTopic, listOfTopics, setListOfTopics } =
        useContext(AppContext)
    const descriptionRef = useRef()
    const [alert, setAlert] = useState(null)
    const history = useHistory()

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const isEmptyTopic = topicToCheck => {
        if (!topicToCheck) return true

        const { name } = topicToCheck

        if (name === '') return true

        return false
    }

    const update = async topic => {
        try {
            await updateTopic(topic)
            history.push('/topics')
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Error al modificar la descripción del tema',
            })
        }
    }

    const createTopic = async topic => {
        try {
            const createdTopic = await createNewTopic(topic)
            setListOfTopics(
                [...listOfTopics, createdTopic].sort(orderListByName)
            )
            history.push('/topics')
        } catch (error) {
            console.log(error)
            setAlert({
                type: 'error',
                message: 'Error al crear el nuevo tema',
            })
        }
    }

    const handleSubmit = e => {
        e.preventDefault()

        // Manejo de errores
        if (!description || description === '') {
            setAlert({
                type: 'error',
                message: 'La descripción es obligatoria',
            })
            return
        }

        if (!isEmptyTopic(currentTopic)) {
            const topic = {
                ...currentTopic,
                description,
            }
            update(topic)
        } else {
            const topic = {
                description,
                subjectId: currentSubject.id,
            }
            createTopic(topic)
        }
    }

    const handleBack = () => {
        history.push('/topics')
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
        console.log('currentTopic', currentTopic)
        if (currentTopic) {
            setInputData({
                subjectId: currentTopic.subjectId,
                id: currentTopic.id,
                description: currentTopic.description,
            })
        } else {
            setInputData({
                ...inputData,
                id: '',
                description: '',
            })
        }
        descriptionRef.current.focus()
    }, [currentTopic])

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <MainLayout>
            <div className='card topic__container'>
                <form className='topic__form' onSubmit={handleSubmit}>
                    <h1 className='form__title'>
                        {`Crea o modifica temas de
                        ${currentSubject && currentSubject.name}`}
                    </h1>
                    {alert && (
                        <Alert type={alert.type} message={alert.message} />
                    )}
                    <input
                        type='text'
                        name='description'
                        value={description}
                        ref={descriptionRef}
                        className='input topic__input'
                        placeholder='Introduce una descripción del tema'
                        onChange={handleChange}
                    />
                    <div className='buttons grid col-2'>
                        <button className='btn' type='submit'>
                            Guardar
                        </button>
                        <button
                            className='back-btn'
                            type='reset'
                            onClick={handleBack}
                        >
                            Volver
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    )
}

export default Topic
