import { useEffect, useContext, useState } from 'react'

// Dependencias
import { NavLink, useHistory } from 'react-router-dom'

// Contexto
import { AppContext } from 'context/AppContext'

// Servicios
import { fetchListOfDocuments, deleteDocument } from '../../firebase/client'

// Componentes
import MainLayout from 'components/MainLayout'
import DocumentItem from 'components/DocumentItem'
import Alert from 'components/Alert'

import './styles.css'

const Documents = () => {
    /* -------------------------------------------------------------------- */
    /* -------------------- CONSTANTES Y DECLARACIONES -------------------- */
    /* -------------------------------------------------------------------- */
    const {
        currentSubject,
        currentTopic,
        listOfDocuments,
        setListOfDocuments,
    } = useContext(AppContext)
    const { description } = currentTopic
    const history = useHistory()
    const [alert, setAlert] = useState(null)

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const openDocument = () => {
        history.push('/document')
    }

    const deleteSelectedDocument = async documentId => {
        try {
            await deleteDocument(documentId)
            setListOfDocuments(
                listOfDocuments.filter(element => element.id !== documentId)
            )
            setAlert({
                type: 'success',
                message: 'Documento eliminado correctamente',
            })
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Error al eliminar el documento',
            })
        }
    }

    const getListOfDocuments = async () => {
        const { id: topicId } = currentTopic
        const documents = await fetchListOfDocuments(topicId)

        setListOfDocuments(documents)
    }

    const handleBack = () => {
        history.push('/topics')
    }

    /* -------------------------------------------------------------------- */
    /* ---------------------------- USE EFFECTS --------------------------- */
    /* -------------------------------------------------------------------- */
    useEffect(() => {
        getListOfDocuments()
    }, [currentTopic])

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <MainLayout className='main'>
            <h1 className='main__h1 display-1'>{`Apuntes de ${description}`}</h1>
            <h3 className='main__h3 display-3'>
                Selecciona un documento de apuntes del tema actual o crea uno{' '}
                <NavLink
                    className='main__nav-link'
                    to='/document'
                    exact
                    activeClassName='active'
                >
                    Nuevo
                </NavLink>
            </h3>
            <div className='back-to-subject' onClick={handleBack}>
                <i className='fas fa-angle-left fa-2x back-icon'></i>
                {` Volver a ${currentSubject.name}`}
            </div>
            <div className='alert-box'>
                {alert && <Alert type={alert.type} message={alert.message} />}
            </div>
            {listOfDocuments && listOfDocuments.length > 0 && (
                <ul className='documents-list'>
                    {listOfDocuments.map(document => (
                        <DocumentItem
                            document={document}
                            deleteSelectedDocument={deleteSelectedDocument}
                            openDocument={openDocument}
                            key={document.id}
                        />
                    ))}
                </ul>
            )}
        </MainLayout>
    )
}

export default Documents
