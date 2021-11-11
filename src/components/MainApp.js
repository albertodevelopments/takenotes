import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

// Componentes
import Login from 'pages/Login'
import NewAccount from 'pages/newAccount'
import Topics from 'pages/topics'
import Documents from 'pages/documents'
import Main from 'pages/main'
import Subject from 'pages/subject'
import Topic from 'pages/topic'
import Document from 'pages/document'

// Contexto
import AppProvider from 'context/AppContext'

const MainApp = () => {
    return (
        <AppProvider>
            <Router>
                <Switch>
                    <Route exact path='/' component={Login}></Route>
                    <Route exact path='/login' component={Login}></Route>
                    <Route
                        exact
                        path='/new-account'
                        component={NewAccount}
                    ></Route>
                    <Route exact path='/topics' component={Topics}></Route>
                    <Route exact path='/topic' component={Topic}></Route>
                    <Route exact path='/document' component={Document}></Route>
                    <Route exact path='/main' component={Main}></Route>
                    <Route exact path='/subject' component={Subject}></Route>
                    <Route
                        exact
                        path='/documents'
                        component={Documents}
                    ></Route>
                </Switch>
            </Router>
        </AppProvider>
    )
}

export default MainApp
