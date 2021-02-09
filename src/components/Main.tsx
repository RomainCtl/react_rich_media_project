import React from 'react';
import { Grid } from '@material-ui/core';
import { DataModel } from 'domain/data-model';
import { VideoPlayer } from 'components/VideoPlayer';
import { ChatRoom } from 'components/ChatRoom';

type MainStateState = {
    data_loaded: boolean,
    data?: DataModel,
}

export class Main extends React.Component<{}, MainStateState> {
    constructor(props: any) {
        super(props);

        this.state = {
            data_loaded: false
        }
    }

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

    render() {
        return (
            <Grid container>
                <Grid className="flex" item xs={8}>
                    <VideoPlayer film={this.state.data?.Film} />
                </Grid>
                <Grid className="relative" item xs={4}>
                    <ChatRoom />
                </Grid>
            </Grid>
        );
    }
}