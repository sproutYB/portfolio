const TopDescription = ({ currentMap }) => {
	return (
		<>
			{currentMap.mapKind == 'inner' && <div className='mapDescBox'>{currentMap.name}</div>}
			{currentMap.mapKind == 'outer' && <div className='mapDescBox'>μμΈμ</div>}
		</>
	);
};

export default TopDescription;
