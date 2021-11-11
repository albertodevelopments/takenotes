import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    GoogleAuthProvider,
    signOut,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    orderBy,
    deleteDoc,
} from 'firebase/firestore'

import firebaseConfig from './config'

initializeApp(firebaseConfig)
const db = getFirestore()

/* -------------------------------------------------------------------- */
/* --------------------------- AUTENTICACIÓN -------------------------- */
/* -------------------------------------------------------------------- */
export const signUpByEmail = async inputData => {
    const { name, email, password } = inputData
    const auth = getAuth()

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )

        const newUser = await userCredential.user
        await updateProfile(auth.currentUser, {
            displayName: name,
        })

        return newUser
    } catch (error) {
        const errorCode = error.code
        console.log('error', error)
        return errorCode
    }
}

export const signInByEmail = async inputData => {
    if (!inputData) return null

    const { email, password } = inputData
    const auth = getAuth()

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        )

        const user = userCredential.user
        return user
    } catch (error) {
        const errorCode = error.code
        console.log(errorCode)
        return errorCode
    }
}

const mapUserFromGoogleAuth = googleUser => {
    if (!googleUser) return null

    const { uid, displayName } = googleUser
    const appUser = {
        uid,
        name: displayName,
    }
    return appUser
}

export const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider()
    const auth = getAuth()

    const result = await signInWithPopup(auth, googleProvider)
    const googleUser = result.user

    return mapUserFromGoogleAuth(googleUser)
}

export const logOut = async () => {
    const auth = getAuth()
    await signOut(auth)
}

/* -------------------------------------------------------------------- */
/* ------------------------- CRUD ASIGNATURAS ------------------------- */
/* -------------------------------------------------------------------- */
export const createNewSubject = async subject => {
    try {
        const subjectRef = await addDoc(collection(db, 'subjects'), subject)

        // Devolvemos el objeto con el id creado
        return {
            ...subject,
            id: subjectRef.id,
        }
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

export const updateSubject = async subject => {
    const { id } = subject
    const subjectRef = doc(db, 'subjects', id)
    try {
        await updateDoc(subjectRef, subject)
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

export const fetchListOfSubjects = async userId => {
    const subjectsRef = collection(db, 'subjects')
    const q = query(subjectsRef, where('userId', '==', userId), orderBy('name'))

    try {
        const querySnapshot = await getDocs(q)

        const resultSet = []

        querySnapshot.forEach(doc => {
            const id = doc.id
            const data = doc.data()
            resultSet.push({
                id,
                ...data,
            })
        })
        return resultSet
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

export const deleteSubject = async subjectId => {
    try {
        await deleteDoc(doc(db, 'subjects', subjectId))
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

/* -------------------------------------------------------------------- */
/* ---------------------------- CRUD TEMAS ---------------------------- */
/* -------------------------------------------------------------------- */
export const createNewTopic = async topic => {
    try {
        const topicRef = await addDoc(collection(db, 'topics'), topic)

        // Devolvemos el objeto con el id creado
        return {
            ...topic,
            id: topicRef.id,
        }
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

export const updateTopic = async topic => {
    console.log(topic)

    const { id } = topic
    const topicRef = doc(db, 'topics', id)
    try {
        await updateDoc(topicRef, topic)
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

export const fetchListOfTopics = async subjectId => {
    const topicsRef = collection(db, 'topics')
    const q = query(
        topicsRef,
        where('subjectId', '==', subjectId),
        orderBy('description')
    )

    try {
        const querySnapshot = await getDocs(q)

        const resultSet = []

        querySnapshot.forEach(doc => {
            const id = doc.id
            const data = doc.data()
            resultSet.push({
                id,
                ...data,
            })
        })
        return resultSet
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

export const deleteTopic = async topicId => {
    try {
        await deleteDoc(doc(db, 'topics', topicId))
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

/* -------------------------------------------------------------------- */
/* ------------------------- CRUD DOCUMENTOS -------------------------- */
/* -------------------------------------------------------------------- */
export const createNewDocument = async document => {
    try {
        const documentRef = await addDoc(collection(db, 'documents'), document)

        // Devolvemos el objeto con el id creado
        return {
            ...document,
            id: documentRef.id,
        }
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

export const updateDocument = async document => {
    const { id } = document
    const documentRef = doc(db, 'documents', id)
    try {
        await updateDoc(documentRef, document)
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

export const fetchListOfDocuments = async topicId => {
    const documentsRef = collection(db, 'documents')
    const q = query(
        documentsRef,
        where('topicId', '==', topicId),
        orderBy('name')
    )

    try {
        const querySnapshot = await getDocs(q)

        const resultSet = []

        querySnapshot.forEach(doc => {
            const id = doc.id
            const data = doc.data()
            resultSet.push({
                id,
                ...data,
            })
        })

        return resultSet
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

export const deleteDocument = async documentId => {
    try {
        await deleteDoc(doc(db, 'documents', documentId))
    } catch (error) {
        console.log(error)
        return 'error'
    }
}
