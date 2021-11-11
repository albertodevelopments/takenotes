import { useContext, useState, useEffect, useRef } from 'react'

// Contexto
import { AppContext } from 'context/AppContext'

// Servicios
import { createNewDocument, updateDocument } from '../../firebase/client'

// Dependencias
import { useHistory } from 'react-router-dom'
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js'

import Editor from 'draft-js-plugins-editor'

// Componentes
import MainLayout from 'components/MainLayout'
import Alert from 'components/Alert'
import { createHighlightPlugin } from 'components/editorPlugins'

import { orderListByName } from 'util'

import './styles.css'
import 'draft-js/dist/Draft.css'

const Document = () => {
    /* -------------------------------------------------------------------- */
    /* --------------------- CONSTANTES Y DECLARACIONES ------------------- */
    /* -------------------------------------------------------------------- */
    const [inputData, setInputData] = useState({
        topicId: '',
        id: '',
        name: '',
        description: '',
        text: '',
        textAlignment: '',
    })
    const { name, description, text, textAlignment } = inputData
    const {
        currentTopic,
        currentDocument,
        listOfDocuments,
        setListOfDocuments,
    } = useContext(AppContext)
    const nameRef = useRef()
    const [alert, setAlert] = useState(null)
    const history = useHistory()

    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    )

    // Colores para el texto seleccionado
    const colors = {
        YELLOW: 'YELLOW_HIGHLIGHT',
        PURPLE: 'PURPLE_HIGHLIGHT',
        BLUE: 'BLUE_HIGHLIGHT',
        RED: 'RED_HIGHLIGHT',
    }
    const { YELLOW, PURPLE, BLUE, RED } = colors
    const highlight = createHighlightPlugin()

    const plugins = [highlight]

    /* -------------------------------------------------------------------- */
    /* ----------------------------- FUNCIONES ---------------------------- */
    /* -------------------------------------------------------------------- */
    const isEmptyDocument = documentToCheck => {
        if (!documentToCheck) return true

        const { name, description, text } = documentToCheck

        if (name === '' && description === '' && text === '') return true

        return false
    }

    const update = async document => {
        try {
            await updateDocument(document)
            history.push('/documents')
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Error al modificar modificar el document',
            })
        }
    }

    const createDocument = async document => {
        try {
            const createdDocument = await createNewDocument(document)
            setListOfDocuments(
                [...listOfDocuments, createdDocument].sort(orderListByName)
            )
            history.push('/documents')
        } catch (error) {
            console.log(error)
            setAlert({
                type: 'error',
                message: 'Error al crear el nuevo documento',
            })
        }
    }

    const handleSubmit = e => {
        e.preventDefault()

        // Manejo de errores
        if (!name || name === '') {
            setAlert({
                type: 'error',
                message: 'El nombre es obligatorio',
            })
            return
        }

        if (!isEmptyDocument(currentDocument)) {
            const document = {
                ...currentDocument,
                name,
                description,
                text: JSON.stringify(
                    convertToRaw(editorState.getCurrentContent())
                ),
                textAlignment,
            }
            update(document)
        } else {
            const document = {
                name,
                description,
                text,
                topicId: currentTopic.id,
                textAlignment,
            }
            createDocument(document)
        }
    }

    const handleBack = () => {
        history.push('/documents')
    }

    const handleChange = e => {
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value,
        })
    }

    const onChangeEditor = editorState => {
        setEditorState(editorState)
    }

    const handleBold = () => {
        onChangeEditor(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
    }

    const handleItalic = () => {
        onChangeEditor(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))
    }

    const handleUnderline = () => {
        onChangeEditor(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))
    }

    const handleStrikeThrough = () => {
        onChangeEditor(
            RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH')
        )
    }

    const handleTextAlignment = textAlignment => {
        setInputData({
            ...inputData,
            textAlignment,
        })
    }

    const handleHighlight = color => {
        onChangeEditor(RichUtils.toggleInlineStyle(editorState, color))
    }

    const handleNestedList = nestedType => {
        onChangeEditor(RichUtils.toggleBlockType(editorState, nestedType))
    }

    /* -------------------------------------------------------------------- */
    /* ---------------------------- USE EFFECTS --------------------------- */
    /* -------------------------------------------------------------------- */
    useEffect(() => {
        if (!isEmptyDocument(currentDocument)) {
            setInputData({
                subjectId: currentDocument.subjectId,
                id: currentDocument.id,
                name: currentDocument.name,
                description: currentDocument.description,
                text: currentDocument.text,
                textAlignment: currentDocument.textAlignment,
            })
        } else {
            setInputData({
                ...inputData,
                id: '',
                name: '',
            })
        }
        nameRef.current.focus()
    }, [currentDocument])

    useEffect(() => {
        if (!text || text === '') return

        setEditorState(
            EditorState.createWithContent(convertFromRaw(JSON.parse(text)))
        )
    }, [text])

    /* -------------------------------------------------------------------- */
    /* --------------------------- RENDERIZADO ---------------------------- */
    /* -------------------------------------------------------------------- */
    return (
        <MainLayout>
            <div className='card document__container'>
                <form className='document__form' onSubmit={handleSubmit}>
                    <h1 className='form__title'>
                        Introduce apuntes de{' '}
                        {`${currentTopic && currentTopic.description}`}
                    </h1>
                    {alert && (
                        <Alert type={alert.type} message={alert.message} />
                    )}
                    <input
                        type='text'
                        name='name'
                        value={name}
                        ref={nameRef}
                        className='input document__input'
                        placeholder='Introduce el nombre del documento de apuntes'
                        onChange={handleChange}
                    />
                    <textarea
                        name='description'
                        value={description}
                        className='textarea document__textarea'
                        placeholder='Introduce una descripción (opcional)'
                        onChange={handleChange}
                    ></textarea>
                    <ul className='tool-list'>
                        <li className='tool' title='Alinear a la izquierda'>
                            <button
                                type='button'
                                className='tool__btn'
                                onClick={() => handleTextAlignment('left')}
                            >
                                <i className='fas fa-align-left'></i>
                            </button>
                        </li>
                        <li className='tool' title='Centrar texto'>
                            <button
                                type='button'
                                className='tool__btn'
                                onClick={() => handleTextAlignment('center')}
                            >
                                <i className='fas fa-align-center'></i>
                            </button>
                        </li>
                        <li className='tool' title='Alinear a la derecha'>
                            <button
                                type='button'
                                className='tool__btn'
                                onClick={() => handleTextAlignment('right')}
                            >
                                <i className='fas fa-align-right'></i>
                            </button>
                        </li>
                        <li className='tool' title='Negrita'>
                            <button
                                type='button'
                                className='tool__btn'
                                onClick={handleBold}
                            >
                                <i className='fas fa-bold'></i>
                            </button>
                        </li>
                        <li className='tool' title='Cursiva'>
                            <button
                                type='button'
                                className='tool__btn'
                                onClick={handleItalic}
                            >
                                <i className='fas fa-italic'></i>
                            </button>
                        </li>
                        <li className='tool' title='Subrayado'>
                            <button
                                type='button'
                                className='tool__btn'
                                onClick={handleUnderline}
                            >
                                <i className='fas fa-underline'></i>
                            </button>
                        </li>
                        <li className='tool' title='Tachado'>
                            <button
                                type='button'
                                className='tool__btn'
                                onClick={handleStrikeThrough}
                            >
                                <i className='fas fa-strikethrough'></i>
                            </button>
                        </li>
                        <li className='tool' title='Lista ordenada'>
                            <button
                                type='button'
                                className='tool__btn'
                                onClick={() =>
                                    handleNestedList('ordered-list-item')
                                }
                            >
                                <i className='fas fa-list-ol'></i>
                            </button>
                        </li>
                        <li className='tool' title='Lista desordenada'>
                            <button
                                type='button'
                                className='tool__btn'
                                onClick={() =>
                                    handleNestedList('unordered-list-item')
                                }
                            >
                                <i className='fas fa-list-ul'></i>
                            </button>
                        </li>
                        <li className='tool' title='Resaltado en amarillo'>
                            <button
                                type='button'
                                className='tool__btn yellow-btn'
                                onClick={() => handleHighlight(YELLOW)}
                            >
                                <i className='fas fa-highlighter'></i>
                            </button>
                        </li>
                        <li className='tool' title='Resaltado en púrpura'>
                            <button
                                type='button'
                                className='tool__btn purple-btn'
                                onClick={() => handleHighlight(PURPLE)}
                            >
                                <i className='fas fa-highlighter'></i>
                            </button>
                        </li>
                        <li className='tool' title='Resaltado en azul'>
                            <button
                                type='button'
                                className='tool__btn blue-btn'
                                onClick={() => handleHighlight(BLUE)}
                            >
                                <i className='fas fa-highlighter'></i>
                            </button>
                        </li>
                        <li className='tool' title='Resaltado en rojo'>
                            <button
                                type='button'
                                className='tool__btn red-btn'
                                onClick={() => handleHighlight(RED)}
                            >
                                <i className='fas fa-highlighter'></i>
                            </button>
                        </li>
                    </ul>
                    <div className='document__texteditor'>
                        <Editor
                            editorState={editorState}
                            onChange={onChangeEditor}
                            textAlignment={textAlignment}
                            plugins={plugins}
                        />
                    </div>
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

export default Document
