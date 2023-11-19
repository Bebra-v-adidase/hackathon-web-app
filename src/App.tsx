import React from 'react'
import {App as MainApp} from 'konsta/react'

import Messenger from './pages/Messenger'

import './App.css'

function App() {
    return (
        <MainApp theme="ios">
            <Messenger/>
        </MainApp>
    )
}

export default App
