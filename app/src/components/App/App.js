import React, { Component } from 'react';
import Home from '../Home';
import Login from '../Login';
import Header from '../Header';
import { withApollo, ApolloConsumer } from 'react-apollo';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

class App extends Component {
	render() {
		const authToken = localStorage.getItem('AUTH_TOKEN');
		return (
			<div className="App">
				<Header />
				{window.location.pathname.includes('index.html') && <Redirect to="/home" />}
				<Switch>
					<Redirect exact from="/" to="/home" />
					<Route exact path="/login" component={Login} />
					<Route
						exact
						path="/home"
						render={() =>
							authToken ? (
								<ApolloConsumer>{client => <Home client={client} />}</ApolloConsumer>
							) : (
								<Redirect
									to={{
										pathname: '/login',
									}}
								/>
							)
						}
					/>
				</Switch>
			</div>
		);
	}
}

export default withApollo(App);
