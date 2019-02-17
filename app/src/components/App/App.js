import React, { Component } from 'react';
import Home from '../Home';
import Login from '../Login';
import { withApollo, ApolloConsumer } from 'react-apollo';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

class App extends Component {
	render() {
		const authToken = localStorage.getItem('AUTH_TOKEN');
		return (
			<div className="App">
				<Switch>
					<Route
						exact
						path="/home"
						render={() =>
							authToken ? (
								<ApolloConsumer>{client => <Home client={client} />}</ApolloConsumer>
							) : (
								<Redirect
									to={{
										pathname: '/',
									}}
								/>
							)
						}
					/>
					<Route exact path="/" component={Login} />
				</Switch>
			</div>
		);
	}
}

export default withApollo(App);
