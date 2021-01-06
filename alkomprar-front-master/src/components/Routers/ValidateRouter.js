import React from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom'

import Auth from "../../models/Auth";
import settings from '../../settings';

const ValidateRouter = ({ component: Component, ...rest }) => {

    return(
    <Route {...rest} render={(props) => {
        let render;
        let component = <Component {...props} />
        let redirectAdmin = <Redirect to={{
            pathname: settings.authenticated_admin_page,
            state: { from: props.location }
        }} />
        let redirectUser = <Redirect to={{
            pathname: settings.authenticated_user_page,
            state: { from: props.location }
        }} />

        let isOnAdminPage = !!rest.adminPages.filter(word => word === rest.path).length;
        
        if (!!Auth.isAdmin()) {
            render = isOnAdminPage ? component : redirectAdmin;
        }
        else {
            render = !isOnAdminPage ? component : redirectUser;
        }
        return render ;

    }} />
)}

export default ValidateRouter;