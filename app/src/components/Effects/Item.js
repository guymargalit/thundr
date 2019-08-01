import React from 'react';
import { MdPlayCircleFilled, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import './Effects.css';

const Item = ({ title, active, pressItem, previewItem }) => (
	<div className="Effects-item">
		<div onClick={previewItem} className="Effects-item-preview">
			<MdPlayCircleFilled size={22} />
		</div>
		<div onClick={pressItem} className="Effects-clickable">
			<div className="Effects-item-favorite">
				{active ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
			</div>
			<div className="Effects-item-title">{title}</div>
		</div>
	</div>
);

export default Item;
