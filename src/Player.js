import { useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

// const YoutubeMusicApi = require("youtube-music-api");

export default function Player({ trackUri }, { songinfo }) {
  useEffect(() => {}, [trackUri]);

  return (
    <p>
      <b> Now Playing: {songinfo} </b>
      <AudioPlayer
        autoPlay
        src={trackUri}
        onPlay={(e) => console.log("onPlay")}
        // other props here
      />
    </p>
  );
}
