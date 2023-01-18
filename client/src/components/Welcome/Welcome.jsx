import React, {useEffect, useRef, useState} from 'react'
import {withToken} from "../../hocs/withToken";
import {io} from "socket.io-client";
import {BLOCK_TIMEOUT_IN_MINUTES, ROLES} from "../../consts";
import {Field, Form, Formik} from "formik";

const Welcome = (props) => {
    const [users, setUsers] = useState([props.me])
    const [messages, setMessages] = useState([])
    const [blocks, setBlocks] = useState([])

    const me = users.find(el => el.id === props.me.id) ?? props.me

    const socketRef = useRef(null)

    const chatWin = document.getElementById("chat-messages")
    if (chatWin)
        chatWin.scrollTop = chatWin.scrollHeight

    const addUser = (msgUser) => {
        setUsers((usersArr) => usersArr.find(el => el.id === msgUser.id)
            ? [...usersArr]
            : [...usersArr, msgUser])
    }
    const removeUser = (msgUser) => {
        setUsers((usersArr) => [...usersArr.filter(el => el.id !== msgUser.id)])
    }

    useEffect(() => {
        console.log(me)

        socketRef.current = io("http://localhost", {
            query: {
                user_id: me.id
            }
        })

        socketRef.current.on('connection', (msg) => {
            addUser(msg.user)
            setMessages(prevMessages => [...prevMessages, msg])
        })

        socketRef.current.on('disconnection', (msg) => {
            removeUser(msg.user)
            setMessages(prevMessages => [...prevMessages, msg])
        })

        socketRef.current.on('message', (msg) => {
            addUser(msg.user)
            setMessages(prevMessages => [...prevMessages, msg])
        })

        socketRef.current.on('block', (msg) => {
            addUser(msg.user)
            setBlocks(prevBlocks => [...prevBlocks, msg.payload.id])
            setTimeout(() => {
                setBlocks(prevBlocks => [...prevBlocks.filter(el => el !== msg.payload.id)])
            }, BLOCK_TIMEOUT_IN_MINUTES * 60 * 1000)

            let newMessage = {...msg}
            delete newMessage.payload
            setMessages(prevMessages => [...prevMessages, newMessage])
        })

        socketRef.current.on('role', (msg) => {
            removeUser(msg.payload)
            addUser(msg.payload)

            addUser(msg.user)

            let newMessage = {...msg}
            delete newMessage.payload
            setMessages(prevMessages => [...prevMessages, newMessage])
        })

        return () => {
            console.log('cleanup')
            // при размонтировании компонента выполняем отключение сокета
            if (socketRef.current) {
                socketRef.current.emit('disconnection')

                socketRef.current.off('connection')
                socketRef.current.off('disconnection')
                socketRef.current.off('message')
                socketRef.current.off('block')
                socketRef.current.off('role')

                socketRef.current.disconnect()
            }
        }
    }, [])


    const onMessage = (values, {setSubmitting}) => {
        socketRef.current.emit('message', values.message)
        values.message = ''
        setSubmitting(false)
    }

    const onRole = (e, user) => {
        e.preventDefault()
        socketRef.current.emit('role', {
            user_id: user.id,
            role: user.role === ROLES.GUEST ? ROLES.MODERATOR : ROLES.GUEST
        })
    }

    const onBlock = (e, user) => {
        e.preventDefault()
        socketRef.current.emit('block', user)
    }


    return (
        <main className="content mb-4">
            <div className="container p-0">

                <h1 className="h3 my-3">Чат</h1>

                <div className="card">
                    <div className="row g-0">
                        <div className="col-12 col-lg-5 col-xl-4 border-right">
                            <h5 className="h5 mx-4 my-3">Сейчас онлайн</h5>

                            {
                                users.map((user) => (
                                    <a href="#" className="list-group-item list-group-item-action border-0"
                                       key={user.id}>
                                        <div className="d-flex align-items-start">
                                            <img src={(user.id === me.id)
                                                ? "https://bootdey.com/img/Content/avatar/avatar3.png"
                                                : "https://bootdey.com/img/Content/avatar/avatar1.png"}
                                                 className="rounded-circle mr-1" alt="Sharon Lessman" width="40"
                                                 height="40"/>
                                            <div className="flex-grow-1 ml-10">
                                                <span className="fw-bold text-secondary">
                                                    {user.name} {user.id === me.id ? '[Вы]' : ''}
                                                </span>
                                                <div className="small"><span
                                                    className="fas fa-circle chat-online"></span>{user.role}</div>
                                                <div>
                                                    {blocks.indexOf(user.id) !== -1 &&
                                                        <span className="small text-danger">Заблокирован</span>
                                                    }
                                                    {user.role === ROLES.GUEST && me.role !== ROLES.GUEST &&
                                                        blocks.indexOf(user.id) === -1 &&
                                                            <button type="button"
                                                                    onClick={(e) => onBlock(e, user)}
                                                                    disabled={blocks.indexOf(user.id) !== -1}
                                                                    className="btn btn-primary btn-sm action-btn me-1">
                                                                Бан на 1 мин.
                                                            </button>
                                                    }
                                                    {user.role !== ROLES.ADMIN && me.role === ROLES.ADMIN && blocks.indexOf(user.id) === -1 &&
                                                        <button type="button"
                                                                onClick={(e) => onRole(e, user)}
                                                                className="btn btn-success btn-sm action-btn">
                                                            {user.role === ROLES.GUEST
                                                                ? 'Назначить Модератором'
                                                                : 'Назначить Посетителем'
                                                            }
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))
                            }

                            <hr className="d-block d-lg-none mt-1 mb-0"/>
                        </div>

                        <div className="col-12 col-lg-7 col-xl-8">

                            <div className="position-relative">
                                <div id="chat-messages" className="chat-messages px-4 py-5">
                                    <div className="pb-5">
                                        {
                                            messages.map((message) => (
                                                <div key={message.id}
                                                     className={`${message.user.id === me.id ? 'chat-message-right' : 'chat-message-left'} pb-4`}>
                                                    <div>
                                                        <img src={message.user.id === me.id
                                                            ? "https://bootdey.com/img/Content/avatar/avatar3.png"
                                                            : "https://bootdey.com/img/Content/avatar/avatar1.png"}
                                                             className="rounded-circle mr-1" alt="Chris Wood" width="40"
                                                             height="40"/>
                                                        <div
                                                            className="text-muted small text-nowrap mt-2">{message.time}</div>
                                                    </div>
                                                    <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                                        {message.user.id === me.id
                                                            ? <div className="fw-bold text-secondary mb-1">Вы</div>
                                                            : <div
                                                                className="fw-bold text-secondary mb-1">{message.user.name}</div>
                                                        }
                                                        {message.text}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow-0 py-3 px-4 border-top">
                                <Formik
                                    initialValues={{message: ''}}
                                    validate={values => {
                                        const errors = {};
                                        if (!values.message) {
                                            errors.message = 'Заполните поле сообщения';
                                        }
                                        return errors;
                                    }}
                                    onSubmit={onMessage}
                                >
                                    {({isSubmitting}) => (
                                        <Form className="input-group">
                                            <Field type="message" name="message" className="form-control"/>
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                Отправить
                                            </button>
                                        </Form>
                                    )}
                                </Formik>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default withToken(Welcome)
