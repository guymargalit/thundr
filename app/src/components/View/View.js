import React from 'react';
import Keyboard from '../Keyboard';
import Effects from '../Effects';

const View = ({ view }) => {
	if (view === '') {
		return null;
	}

	if (view === 'keyboard') {
		return <Keyboard />;
	}

	if (view === 'effects') {
		return <Effects />;
	}
};

export default View;
