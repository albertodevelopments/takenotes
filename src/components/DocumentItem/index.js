import { useContext } from 'react'

// Dependencias
import PropTypes from 'prop-types'

// Contexto
import { AppContext } from 'context/AppContext'

import './styles.css'

const DocumentItem = ({ document, deleteSelectedDocument, openDocument }) => {
    /* -------------------------------------------------------------------- */
    /* -------------------- CONSTANTES Y DECLARACIONES -------------------- */
    /* -------------------------------------------------------------------- */
    const { setCurrentDocument } = useContext(AppContext)

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const handleDelete = () => {
        deleteSelectedDocument(document.id)
    }

    const handleOpenDocument = () => {
        setCurrentDocument(document)
        openDocument(document)
    }

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <li className='document-item' title='Abre el documento'>
            <div className='document-main'>
                <i
                    className='far fa-file-alt fa-4x'
                    onClick={handleOpenDocument}
                ></i>
                <div>
                    <span className='actions'>
                        <i
                            title='Eliminar documento'
                            className='fas fa-trash delete'
                            onClick={handleDelete}
                        ></i>
                    </span>
                </div>
            </div>
            <div>{document.name}</div>
        </li>
    )
}

export default DocumentItem

DocumentItem.propTypes = {
    document: PropTypes.object.isRequired,
    deleteSelectedDocument: PropTypes.func.isRequired,
    openDocument: PropTypes.func.isRequired,
}
