import { createContext, useState } from 'react'

// Dependencias
import PropTypes from 'prop-types'

export const AppContext = createContext()

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [currentSubject, setCurrentSubject] = useState({
        id: '',
        userId: '',
        name: '',
    })
    const [currentTopic, setCurrentTopic] = useState({
        id: '',
        subjectId: '',
        description: '',
    })
    const [currentDocument, setCurrentDocument] = useState({
        id: '',
        topicId: '',
        name: '',
        description: '',
        text: '',
        textAlignment: '',
    })
    const [listOfSubjects, setListOfSubjects] = useState([])
    const [listOfTopics, setListOfTopics] = useState([])
    const [listOfDocuments, setListOfDocuments] = useState([])

    return (
        <AppContext.Provider
            value={{
                user,
                currentSubject,
                currentTopic,
                currentDocument,
                listOfSubjects,
                listOfTopics,
                listOfDocuments,
                setUser,
                setCurrentSubject,
                setCurrentTopic,
                setCurrentDocument,
                setListOfSubjects,
                setListOfTopics,
                setListOfDocuments,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider

AppProvider.propTypes = {
    children: PropTypes.node,
}
