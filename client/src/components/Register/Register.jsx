import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {API} from "../../api/api";

const Register = () => {
    const [httpError, setHttpError] = useState(null)
    const navigate = useNavigate()

    const onSubmit = (values, {setSubmitting, resetForm}) => {
        API.register(values)
            .then(data => {
                console.log(data.jwt)
                localStorage.setItem('access_token', data.jwt)
                navigate('/')
            })
            .catch(error => {
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
                        <div className="card-header">Регистрация</div>

                        <div className="card-body">

                            { httpError &&
                                <p className="text-center text-danger">{httpError}</p>
                            }

                            <Formik
                                initialValues={{name: '', login: '', password: '', password_confirmation: ''}}
                                validate={values => {
                                    const errors = {}
                                    if (!values.name) {
                                        errors.name = 'Обязательное поле'
                                    }
                                    if (!values.login) {
                                        errors.login = 'Обязательное поле'
                                    }
                                    if (!values.password) {
                                        errors.password = 'Обязательное поле'
                                    }
                                    else {
                                        if(!values.password_confirmation)
                                            errors.password_confirmation = 'Требуется подтвердить пароль'
                                        else if(values.password !== values.password_confirmation)
                                            errors.password_confirmation = 'Пароли не совпадают'
                                    }
                                    return errors
                                }}
                                onSubmit={onSubmit}
                            >
                                {({isSubmitting}) => (
                                    <Form>
                                        <div className="row mb-3">
                                            <label htmlFor="name" className="col-md-4 col-form-label text-md-end">Ваше имя</label>
                                            <div className="col-md-6">
                                                <Field type="text" name="name" className="form-control"/>
                                                <ErrorMessage name="name" component="div" className="text-danger"/>
                                            </div>
                                        </div>
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
                                        <div className="row mb-3">
                                            <label htmlFor="password_confirmation"
                                                   className="col-md-4 col-form-label text-md-end">Пароль</label>
                                            <div className="col-md-6">
                                                <Field type="password" name="password_confirmation" className="form-control"/>
                                                <ErrorMessage name="password_confirmation" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="row mb-0">
                                            <div className="col-md-8 offset-md-4">
                                                <button type="submit" disabled={isSubmitting}
                                                        className="btn btn-primary">
                                                    Зарегистрироваться
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

export default Register
