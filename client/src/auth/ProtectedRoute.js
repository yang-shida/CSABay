import React from 'react'
import { Route, Redirect } from "react-router-dom";
import auth from '../auth/auth'

const ProtectedRoute = ({isAuth, render: RenderComponents, ...rest}) => {
    return (
        <Route
            {...rest}
            render={
                props => {
                    if (isAuth) {
                        console.log("auth")
                        return <RenderComponents {...props} />;
                    } 
                    else {
                        console.log("not auth")
                        return (
                            <Redirect
                            to={{
                                pathname: "/missing-permission",
                                state: {
                                from: props.location
                                }
                            }}
                            />
                        );
                    }
                }
            }
        />
    )
}

export default ProtectedRoute
