import React from 'react';
import { Grid, AppBar, Tabs, Tab } from '@material-ui/core';
import { DataModel } from 'domain/data-model';
import { VideoPlayer } from 'components/VideoPlayer';
import { ChatRoom } from 'components/ChatRoom';
import { TabPanel } from 'components/TabPanel';

type MainStateState = {
    data_loaded: boolean,
    current_time: number,
    data?: DataModel,
    tab_value: number,
}

export class Main extends React.Component<{}, MainStateState> {

    constructor(props: any) {
        super(props);

        this.state = {
            data_loaded: false,
            current_time: 0,
            tab_value: 0
        }

        this.tabsHandleChange = this.tabsHandleChange.bind(this);
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

    tabsHandleChange(e: React.ChangeEvent<{}>, new_value: number) {
        this.setState({
            tab_value: new_value
        });
    }

    render() {
        return (
            <Grid container spacing={2} className="body">
                <Grid className="flex" item xs={8}>
                    <VideoPlayer film={this.state.data?.Film} current_time={this.state.current_time} onTimeUpdate={this.handleCurrentTime} />
                </Grid>
                <Grid item xs={4}>
                    <ChatRoom />
                </Grid>
                <Grid item xs={12}>
                    <AppBar position="static">
                        <Tabs
                            value={this.state.tab_value}
                            onChange={this.tabsHandleChange}>
                            <Tab label="Chapters" />
                            <Tab label="Map" />
                            <Tab label="Keywords" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.tab_value} index={0}>
                        Tab one
                    </TabPanel>
                    <TabPanel value={this.state.tab_value} index={1}>
                        Tab two
                    </TabPanel>
                    <TabPanel value={this.state.tab_value} index={2}>
                        Tab three
                    </TabPanel>
                </Grid>
            </Grid>
        );
    }
}