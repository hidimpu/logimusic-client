import { useState, useEffect } from "react";
import useAuth from "./useAuth";

import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";

import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "422fb144926046c696d4149ba8ad47f8",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [trackUri, setTrackUri] = useState("");

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("https://logimusic-server.herokuapp.com/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => setLyrics(res.data.lyrics));
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;

    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;

      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  async function handlePlay(track) {
    chooseTrack(track);
    const song = { title: track.title, artist: track.artist };

    const { data } = await axios.post(
      "https://logimusic-server.herokuapp.com/song",
      {
        song,
      }
    );

    setTrackUri(data);
  }

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists "
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
            handlePlay={handlePlay}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whitespace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>

      <div>
        <b>
          Made with ❤ by
          <a target="_blank" href="https://github.com/hidimpu">
            {" "}
            Parth{" "}
          </a>{" "}
        </b>
        <Player trackUri={trackUri} />
      </div>
    </Container>
  );
}
