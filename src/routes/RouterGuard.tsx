import * as React from "react";
import {Route} from "react-router-dom";
import AMisRenderer from "../components/AMisRenderer";

import {NotFound,Spinner} from 'amis';

export default class RouterGuard extends React.Component<any, any> {
    
    componentDidMount() {
        this.refreshRoute()
    }

    state = {
        pathname: '',
        component: Spinner,
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        this.refreshRoute()
    }

    refreshRoute = () => {
        const pathname = this.props.location.pathname;
        if (this.state.pathname !== pathname) {
            this.setState({
                'pathname': pathname,
                'component': () => <AMisRenderer schema={this.props.schema || {}} permsCode={this.props.permsCode} />,
            });
        }
    }


    render() {

        return (
            <Route
                key={this.state.pathname}
                path={this.state.pathname}
                component={this.state.component}
                exact
            />);
    }
}