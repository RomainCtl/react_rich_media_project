import React from 'react';
import { Grid } from '@material-ui/core';
import { DataModel } from 'domain/data-model';
import { VideoPlayer } from 'components/VideoPlayer';
import { ChatRoom } from 'components/ChatRoom';

type MainStateState = {
    data_loaded: boolean,
    current_time: number,
    data?: DataModel,
}

export class Main extends React.Component<{}, MainStateState> {
    constructor(props: any) {
        super(props);

        this.state = {
            data_loaded: false,
            current_time: 0
        }
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

    render() {
        return (
            <Grid container spacing={2} className="body">
                <Grid className="flex" item xs={8}>
                    <VideoPlayer film={this.state.data?.Film} current_time={this.state.current_time} />
                </Grid>
                <Grid item xs={4}>
                    <ChatRoom />
                </Grid>
            </Grid>
        );
    }
}