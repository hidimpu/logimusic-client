import React from 'react';

export default function TrackSearchResult({ track, chooseTrack, handlePlay }) {
	// async function handlePlay() {
	// 	chooseTrack(track);
	// 	const song = { title: track.title, artist: track.artist };

	// 	const { data } = await axios.post('http://localhost:3001/song', {
	// 		song,
	// 	});
	// 	console.log(data);
	// }

	return (
		<div
			className="d-flex m-2 align-items-center"
			style={{ cursor: 'pointer' }}
			onClick={() => handlePlay(track)}
		>
			<img
				src={track.albumUrl}
				alt={'song'}
				style={{ height: '64px', width: '64px  ' }}
			/>
			<div className="ml-3">
				<div className="px-4"> {track.title} </div>
				<div className="text-muted px-4"> {track.artist} </div>
			</div>
		</div>
	);
}
