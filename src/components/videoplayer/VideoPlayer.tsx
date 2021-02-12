import React from 'react';
import { FilmModel } from 'domain/film-model';
import CircularProgress from '@material-ui/core/CircularProgress';

import "./VideoPlayer.css";

type VideoPlayerProps = {
    film?: FilmModel;
    current_time?: number; // seconde
    onTimeUpdate?: Function;
    onDurationLoaded?: Function;
}

export class VideoPlayer extends React.Component<VideoPlayerProps> {
    private playerRef: any;

    constructor(props: VideoPlayerProps) {
        super(props);

        this.playerRef = React.createRef();

        this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
    }

    /**
     * Each time react did update this component
     * @param prevProps
     */
    componentDidUpdate(prevProps: VideoPlayerProps) {
        // update video currentTime if needed
        if (prevProps.current_time && this.props.current_time) {
            const time_diff = prevProps.current_time - this.props.current_time;
            // Do not update if diff < 1 (to prevent the update on playing)
            if (time_diff < -1 || time_diff > 1) {
                this.playerRef.current.currentTime = this.props.current_time;
            }
        }
    }

    /**
     * When 'video' metadata is loaded
     * Set asked start time
     * Send video duration to parent
     * @param e
     */
    onLoadedMetadata(e: React.SyntheticEvent<HTMLVideoElement>) {
        if (this.props.current_time) {
            e.currentTarget.currentTime = this.props.current_time;
        }
        if (this.props.onDurationLoaded) {
            this.props.onDurationLoaded(e.currentTarget.duration);
        }
    }

    /**
     * When playing (not only), send new current_time to parent
     * @param e
     */
    onTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
        if (this.props.onTimeUpdate) {
            this.props.onTimeUpdate(e.currentTarget.currentTime);
        }
    }

    render() {
        const { film } = this.props;
        if (film) {
            return (
                <div id="video">
                    <video
                        ref={this.playerRef}
                        height="480"
                        src={film.file_url}
                        controls
                        onLoadedMetadata={this.onLoadedMetadata}
                        onTimeUpdate={this.onTimeUpdate}>
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