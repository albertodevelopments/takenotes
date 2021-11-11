import { useEffect, useContext, useState } from 'react'

// Dependencias
import { NavLink, useHistory } from 'react-router-dom'

// Contexto
import { AppContext } from 'context/AppContext'

// Servicios
import { fetchListOfTopics, deleteTopic } from '../../firebase/client'

// Componentes
import MainLayout from 'components/MainLayout'
import TopicItem from 'components/TopicItem'
import Alert from 'components/Alert'

import './styles.css'

const Topics = () => {
    /* -------------------------------------------------------------------- */
    /* -------------------- CONSTANTES Y DECLARACIONES -------------------- */
    /* -------------------------------------------------------------------- */
    const { currentSubject, listOfTopics, setCurrentTopic, setListOfTopics } =
        useContext(AppContext)
    const { name } = currentSubject
    const history = useHistory()
    const [alert, setAlert] = useState(null)

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const editTopic = () => {
        history.push('/topic')
    }

    const deleteSelectedTopic = async topicId => {
        try {
            await deleteTopic(topicId)
            setListOfTopics(
                listOfTopics.filter(element => element.id !== topicId)
            )
            setAlert({
                type: 'success',
                message: 'Carpeta eliminada correctamente',
            })
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Error al eliminar el tema',
            })
        }
    }

    const openTopicFolder = topic => {
        setCurrentTopic(topic)
        history.push('/documents')
    }

    const getListOfTopics = async () => {
        const { id: subjectId } = currentSubject
        const topics = await fetchListOfTopics(subjectId)

        setListOfTopics(topics)
    }

    const handleNew = () => {
        setCurrentTopic(null)
    }

    /* -------------------------------------------------------------------- */
    /* ---------------------------- USE EFFECTS --------------------------- */
    /* -------------------------------------------------------------------- */
    useEffect(async () => {
        getListOfTopics()
    }, [currentSubject])

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <MainLayout className='main'>
            <h1 className='main__h1 display-1'>
                {`Apuntes de la asignatura ${name}`}
            </h1>
            <h3 className='main__h3 display-3'>
                Selecciona una carpeta con el tema de la asignatura o crea uno{' '}
                <NavLink
                    className='main__nav-link'
                    to='/topic'
                    exact
                    activeClassName='active'
                    onClick={handleNew}
                >
                    Nuevo
                </NavLink>
            </h3>
            <div className='alert-box'>
                {alert && <Alert type={alert.type} message={alert.message} />}
            </div>
            {listOfTopics && listOfTopics.length > 0 && (
                <ul className='topics-list'>
                    {listOfTopics.map(topic => (
                        <TopicItem
                            topic={topic}
                            editTopic={editTopic}
                            deleteSelectedTopic={deleteSelectedTopic}
                            openTopicFolder={openTopicFolder}
                            key={topic.id}
                        />
                    ))}
                </ul>
            )}
        </MainLayout>
    )
}

export default Topics
