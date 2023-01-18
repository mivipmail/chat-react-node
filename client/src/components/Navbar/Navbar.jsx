import React from 'react'
import {Link, useNavigate} from "react-router-dom";

const Navbar = () => {
    const access_token = localStorage.getItem('access_token')
    const navigate = useNavigate()

    const onLogout = () => {
        localStorage.removeItem('access_token')
        navigate('/login')
    }

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div className="container">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    <ul className="navbar-nav ms-auto">
                        { access_token &&
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Главная</Link>
                            </li>
                        }

                        { !access_token &&
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">Логин</Link>
                            </li>
                        }

                        { !access_token &&
                            <li className="nav-item">
                                <Link to="/register" className="nav-link">Регистрация</Link>
                            </li>
                        }

                        { access_token &&
                            <li className="nav-item">
                                <button className="nav-link bg-transparent border-0" onClick={onLogout}>Выйти</button>
                            </li>
                        }

                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
