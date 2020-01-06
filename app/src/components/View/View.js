import React from 'react';
import Keyboard from '../Keyboard';
import Effects from '../Effects';
import Experimental from '../Experimental';

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

	if (view === 'experimental') {
		return <Experimental />
	}
};

export default View;
