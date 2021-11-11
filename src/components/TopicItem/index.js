import { useContext } from 'react'

// Dependencias
import PropTypes from 'prop-types'

// Contexto
import { AppContext } from 'context/AppContext'

import './styles.css'

const TopicItem = ({
    topic,
    editTopic,
    deleteSelectedTopic,
    openTopicFolder,
}) => {
    /* -------------------------------------------------------------------- */
    /* -------------------- CONSTANTES Y DECLARACIONES -------------------- */
    /* -------------------------------------------------------------------- */
    const { setCurrentTopic } = useContext(AppContext)

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const handleEdit = () => {
        setCurrentTopic(topic)
        editTopic(topic)
    }

    const handleDelete = () => {
        setCurrentTopic(null)
        deleteSelectedTopic(topic.id)
    }

    const handleOpenTopic = () => {
        openTopicFolder(topic)
    }

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <li className='topic-item' title='Abre el tema'>
            <div className='topic-main'>
                <i
                    className='fas fa-folder fa-4x'
                    onClick={handleOpenTopic}
                ></i>
                <div>
                    <span className='actions'>
                        <i
                            title='Editar tema'
                            className='far fa-edit edit'
                            onClick={handleEdit}
                        ></i>
                        <i
                            title='Eliminar tema'
                            className='fas fa-trash delete'
                            onClick={handleDelete}
                        ></i>
                    </span>
                </div>
            </div>
            <div>{topic.description}</div>
        </li>
    )
}

export default TopicItem

TopicItem.propTypes = {
    topic: PropTypes.object.isRequired,
    editTopic: PropTypes.func.isRequired,
    deleteSelectedTopic: PropTypes.func.isRequired,
    openTopicFolder: PropTypes.func.isRequired,
}
