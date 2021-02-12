import React from "react";
import { CircularProgress, LinearProgress, Tooltip, Typography, List, Chip, Link } from '@material-ui/core';
import { ChapterModel } from 'domain/chapter-model';
import secToReadable from 'utils/sec-to-readable';

import "./Chapters.css";

type ChaptersProps = {
    chapters?: ChapterModel[];
    onSelectTime: Function;
    current_time?: number;
    max_time?: number
}

type ChaptersState = {
    current_chapter?: ChapterModel;
}

export class Chapters extends React.Component<ChaptersProps, ChaptersState> {
    private tooltipRef: any;

    constructor(props: ChaptersProps) {
        super(props);

        this.state = {
            current_chapter: undefined
        }

        this.tooltipRef = React.createRef();

        this.handleProgressClick = this.handleProgressClick.bind(this);
        this.updateHoverChapter = this.updateHoverChapter.bind(this);
    }

    /**
     * Get offset of an element (with the last parent)
     * @param element
     */
    getOffset(element: HTMLElement) {
        let el: HTMLElement | null = element;
        let _x = 0;
        let _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent as HTMLElement;
        }
        return { top: _y, left: _x };
    }
    /**
     * Get "time" position in the progress bar (timeline)
     * @param evt
     */
    getTimePositionInProgressBar(evt: React.MouseEvent<HTMLDivElement>) {
        if (this.props.max_time) {
            const bar_width = evt.currentTarget.clientWidth || evt.currentTarget.offsetWidth;
            const x_position = evt.clientX || evt.screenX;

            const left_space = this.getOffset(evt.currentTarget).left;
            const time_position = x_position - left_space;

            return time_position * this.props.max_time / bar_width;
        } else {
            return null;
        }
    }

    /**
     * On click on the progress bar (timeline)
     * Change video current time
     * @param evt
     */
    handleProgressClick(evt: React.MouseEvent<HTMLDivElement>) {
        const t = this.getTimePositionInProgressBar(evt);
        if (t !== null) {
            this.props.onSelectTime(t);
        }
    }
    /**
     * On hover on the progress bar (timeline)
     * Tooltip with the current chapter name
     * @param evt
     */
    updateHoverChapter(evt: React.MouseEvent<HTMLDivElement>) {
        if (this.props.chapters !== undefined) {
            const t = this.getTimePositionInProgressBar(evt);
            if (t !== null) {
                const c = this.props.chapters.sort(
                    (a, b) => parseInt(b.pos) - parseInt(a.pos)
                )
                for (let entry of c) {
                    if (parseInt(entry.pos) <= t) {
                        this.setState({
                            current_chapter: entry
                        });
                        break;
                    }
                }
            }
        }
    }

    render() {
        const { current_time, max_time, chapters } = this.props;
        const { current_chapter } = this.state;
        if (chapters) {
            return (
                <div>
                    <Tooltip title={
                        <React.Fragment>
                            <Typography>{current_chapter ? current_chapter.title : "Loading..."}</Typography>
                        </React.Fragment>
                    }
                        ref={this.tooltipRef}
                        arrow
                        followCursor
                        onMouseMoveCapture={this.updateHoverChapter}
                        onMouseOver={this.updateHoverChapter}>
                        <LinearProgress
                            className="timeline"
                            onClick={this.handleProgressClick}
                            variant="determinate"
                            value={(current_time || 0) * 100 / (max_time || 0)} />
                    </Tooltip>
                    <List className="chapter_list">
                        {chapters.sort((a, b) => parseInt(a.pos) - parseInt(b.pos)).map((chapter: ChapterModel, index: number) => (
                            <Chip
                                key={index}
                                color={(current_time || 0) > parseInt(chapter.pos) ? "primary" : "default"}
                                label={
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        onClick={() => this.props.onSelectTime(parseInt(chapter.pos))}>
                                        {chapter.title} {secToReadable(chapter.pos)}
                                    </Link>
                                } />
                        ))}
                    </List>
                </div >
            );
        } else {
            return (
                <div>
                    <p>Where are the chapters...</p>
                    <CircularProgress size={60} color="inherit" />
                </div>
            )
        }
    }
}