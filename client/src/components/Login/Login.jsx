import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"
import {API} from "../../api/api"
import {ErrorMessage, Field, Form, Formik} from "formik"

const Login = () => {
    const [httpError, setHttpError] = useState(null)
    const navigate = useNavigate()

    const onSubmit = (values, {setSubmitting, resetForm}) => {
        API.login(values).then(data => {
            console.log(data.jwt)
            localStorage.setItem('access_token', data.jwt)
            navigate('/')
        }).catch(error => {
            setHttpError(error.response.data.message)
            setTimeout(() => setHttpError(null), 3000)
        })

        resetForm()
        setSubmitting(false)
    }

    return (
        <div className="container pt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Авторизация</div>

                        <div className="card-body">

                            {httpError &&
                                <p className="text-center text-danger">{httpError}</p>
                            }

                            <Formik
                                initialValues={{login: '', password: ''}}
                                validate={values => {
                                    const errors = {}
                                    if (!values.login) {
                                        errors.login = 'Обязательное поле'
                                    }
                                    if (!values.password) {
                                        errors.password = 'Обязательное поле'
                                    }
                                    return errors
                                }}
                                onSubmit={onSubmit}
                            >
                                {({isSubmitting}) => (
                                    <Form>
                                        <div className="row mb-3">
                                            <label htmlFor="login" className="col-md-4 col-form-label text-md-end">Логин</label>
                                            <div className="col-md-6">
                                                <Field type="text" name="login" className="form-control"/>
                                                <ErrorMessage name="login" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label htmlFor="password"
                                                   className="col-md-4 col-form-label text-md-end">Пароль</label>
                                            <div className="col-md-6">
                                            <Field type="password" name="password" className="form-control"/>
                                            <ErrorMessage name="password" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="row mb-0">
                                            <div className="col-md-8 offset-md-4">
                                                <button type="submit" disabled={isSubmitting}
                                                        className="btn btn-primary">
                                                    Войти
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
