import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Welcome from "./Welcome/Welcome";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Navbar from "./Navbar/Navbar";
import Error404 from "./Error404/Error404";

const App = () => {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Welcome/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='*' element={<Error404/>}/>
            </Routes>
        </Router>
    );
}

export default App