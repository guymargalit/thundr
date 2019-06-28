import React from 'react';
import Keyboard from '../Keyboard';

const View = ({ view }) => {
	if (view === '') {
		return null;
	}

	if (view === 'keyboard') {
		return <Keyboard />;
	}

	if (view === 'settings') {
		return null;
	}
};

export default View;
