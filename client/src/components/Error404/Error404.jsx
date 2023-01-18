import React from 'react'
import {withToken} from "../../hocs/withToken";

const Error404 = () => {
    return (
        <div className="text-center m-5 p-5">
            <h1>Ошибка 404</h1>
        </div>
    )
}

export default withToken(Error404)
