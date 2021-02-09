import React from 'react';
import { FilmModel } from 'domain/film-model';
import CircularProgress from '@material-ui/core/CircularProgress';

import "./VideoPlayer.css";

type VideoPlayerProps = {
    film: FilmModel | undefined;
}

export class VideoPlayer extends React.Component<VideoPlayerProps> {
    render() {
        const { film } = this.props;
        if (film !== undefined) {
            return (
                <div id="video">
                    <video height="480" src={film.file_url} controls>
                        Your browser does not support HTML video
                    </video>
                </div>
            );
        } else {
            return (
                <div id="video">
                    <p>Video is coming ! <i>or not...</i></p>
                    <CircularProgress size={60} color="inherit" />
                </div>
            )
        }
    }
}