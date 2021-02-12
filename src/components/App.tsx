import React from 'react';
import { Grid, AppBar, Tabs, Tab, Alert, CircularProgress } from '@material-ui/core';
import { DataModel } from 'domain/data-model';
import { VideoPlayer } from 'components/videoplayer/VideoPlayer';
import { ChatRoom } from 'components/chatroom/ChatRoom';
import { TabPanel } from 'components/tabpanel/TabPanel';
import { Chapters } from 'components/chapter/Chapters';
import { Map } from 'components/map/Map';
import { Keywords } from 'components/keywords/Keywords';

import "./App.css";

type AppStateState = {
    data_loaded: boolean,
    current_time: number,
    duration: number,
    data?: DataModel,
    tab_value: number,
}

export class App extends React.Component<{}, AppStateState> {

    constructor(props: any) {
        super(props);

        this.state = {
            data_loaded: false,
            current_time: 0,
            duration: 0,
            tab_value: 0
        }

        this.tabsHandleChange = this.tabsHandleChange.bind(this);
        this.handleCurrentTime = this.handleCurrentTime.bind(this);
        this.handleDuration = this.handleDuration.bind(this);
    }

    /**
     * One time, when component did mount
     */
    componentDidMount() {
        fetch("https://imr3-react.herokuapp.com/backend")
            .then(res => res.json())
            .then((res: DataModel) => {
                console.debug(res);
                this.setState({
                    data_loaded: true,
                    data: res
                });
            })
            .catch(err => {
                console.debug("Error!!");
                console.error(err);
                this.setState({
                    data_loaded: false,
                });
            });
    }

    /**
     * When 'current_time' change (can be from child component)
     * @param new_current_time
     */
    handleCurrentTime(new_current_time: number) {
        this.setState({
            current_time: new_current_time
        });
    }

    /**
     * When 'duration' change (from child component)
     * It is for the progress bar (max current_time)
     * @param duration
     */
    handleDuration(duration: number) {
        this.setState({
            duration: duration
        });
    }

    /**
     * Select which tab to display (chapters, map, keywords)
     * @param e
     * @param new_value
     */
    tabsHandleChange(e: React.ChangeEvent<{}>, new_value: number) {
        this.setState({
            tab_value: new_value
        });
    }

    render() {
        const { data_loaded, current_time, duration, data, tab_value } = this.state;
        const main = (
            <Grid container spacing={2} className="body">
                {/* Video player */}
                <Grid className="flex" item md={8} sm={12}>
                    <VideoPlayer
                        film={data?.Film}
                        current_time={current_time}
                        onDurationLoaded={this.handleDuration}
                        onTimeUpdate={this.handleCurrentTime} />
                </Grid>
                {/* Chatroom */}
                <Grid className="chat" item md={4} sm={12}>
                    <ChatRoom />
                </Grid>
                <Grid item xs={12}>
                    <AppBar position="static">
                        <Tabs
                            value={tab_value}
                            onChange={this.tabsHandleChange}
                            variant="fullWidth"
                            className="tabBaseColor">
                            <Tab label="Chapters" />
                            <Tab label="Map" />
                            <Tab label="Keywords" />
                        </Tabs>
                    </AppBar>
                    {/* Chapters */}
                    <TabPanel value={tab_value} index={0}>
                        <Chapters
                            current_time={current_time}
                            max_time={duration}
                            chapters={data?.Chapters}
                            onSelectTime={this.handleCurrentTime} />
                    </TabPanel>
                    {/* Waypoints */}
                    <TabPanel value={tab_value} index={1}>
                        <Map
                            current_time={current_time}
                            waypoints={data?.Waypoints}
                            onPointTimeSelected={this.handleCurrentTime} />
                    </TabPanel>
                    {/* Kaywords */}
                    <TabPanel value={tab_value} index={2}>
                        <Keywords
                            current_time={current_time}
                            keywords={data?.Keywords}
                            onTimeSelected={this.handleCurrentTime} />
                    </TabPanel>
                </Grid>
            </Grid>
        );

        if (data_loaded) {
            return main;
        } else {
            return (
                <div>
                    <div className="blurBackground">
                        {main}
                    </div>
                    <div className="blurContent">
                        <Alert severity="info">Loading data...
                        <CircularProgress size={20} /></Alert>
                    </div>
                </div>
            );
        }
    }
}