import React from 'react';
import { Grid, AppBar, Tabs, Tab } from '@material-ui/core';
import { DataModel } from 'domain/data-model';
import { VideoPlayer } from 'components/VideoPlayer';
import { ChatRoom } from 'components/ChatRoom';
import { TabPanel } from 'components/TabPanel';
import { Chapters } from 'components/Chapters';

import "./Main.css";

type MainStateState = {
    data_loaded: boolean,
    current_time: number,
    duration: number,
    data?: DataModel,
    tab_value: number,
}

export class Main extends React.Component<{}, MainStateState> {

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

    componentDidMount() {
        fetch("https://imr3-react.herokuapp.com/backend")
            .then(res => res.json())
            .then((res: DataModel) => {
                console.info(res);
                this.setState({
                    data_loaded: true,
                    data: res
                });
            })
            .catch(err => {
                console.info("Error!!");
                console.error(err);
                this.setState({
                    data_loaded: false,
                });
            });
    }

    handleCurrentTime(new_current_time: number) {
        this.setState({
            current_time: new_current_time
        });
    }
    handleDuration(duration: number) {
        this.setState({
            duration: duration
        });
    }

    tabsHandleChange(e: React.ChangeEvent<{}>, new_value: number) {
        this.setState({
            tab_value: new_value
        });
    }

    render() {
        const { data_loaded, current_time, duration, data, tab_value } = this.state;
        return (
            <Grid container spacing={2} className="body">
                <Grid className="flex" item md={8} sm={12}>
                    <VideoPlayer
                        film={data?.Film}
                        current_time={current_time}
                        onDurationLoaded={this.handleDuration}
                        onTimeUpdate={this.handleCurrentTime} />
                </Grid>
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
                    <TabPanel value={tab_value} index={0}>
                        <Chapters
                            current_time={current_time}
                            max_time={duration}
                            chapters={data?.Chapters}
                            onSelectTime={this.handleCurrentTime} />
                    </TabPanel>
                    <TabPanel value={tab_value} index={1}>
                        Tab two
                    </TabPanel>
                    <TabPanel value={tab_value} index={2}>
                        Tab three
                    </TabPanel>
                </Grid>
            </Grid>
        );
    }
}