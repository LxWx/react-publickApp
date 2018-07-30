import React, { Component } from 'react';
import { Router, Route, Switch, withRouter} from 'react-router-dom';
import Login from 'bundle-loader?lazy!../containers/Login/index.jsx';
import Main from '../containers/layout/Main.jsx';
import { webHistory } from '../utils/index.js';
import { config } from '../config/config';
import Bundle from './Bundle';
import { connect } from 'react-redux';
import { NoMatch } from 'components';
import * as Auth from 'auth';
import * as Act from 'commonStore/login/actions';
// if (!window.Intl) {
//     require('intl');
// }
@connect((state, props) => ({
    user: state.login
}))
class Routes extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        const {user} = this.props;
        // 登录跳转
        if (user.ownerCode) {
            const {dispatch} = this.props;
            dispatch(Act.userLoggedIn(user.ownerCode));
        }
    }
    getComponent(n, c) {
        return n && Bundle.create(c) || c;
    }
    render() {
        return (
            <Router history={webHistory}>
                <Switch>
                    <Route path='/login' component={withRouter(Bundle.create(Login))} />
                    <Route path='/' exact component={withRouter(Bundle.create(Login))} />
                    <Main show={this.show} user={this.props.user}>
                        <Switch>
                            {
                                config.routeList.map((item, i) => {
                                    return <Route key={i} path={item.path} component={Auth.userIsAuthenticatedRedir(this.getComponent(item.isBundle, item.comp))} />;
                                })
                            }
                            <Route component={Auth.userIsAuthenticatedRedir(NoMatch)} />
                        </Switch>
                    </Main>
                </Switch>
            </Router>

        );
    }
}

export default Routes;