import React from 'react';
import { CircularProgress, Chip, Card, CardActions, CardContent, Button, Link } from '@material-ui/core';
import { KeywordModel } from 'domain/keyword-model';
import secToReadable from 'utils/sec-to-readable';

import './Keywords.css';

type KeywordsProps = {
    keywords?: KeywordModel[];
    onTimeSelected: Function;
    current_time?: number;
}

export class Keywords extends React.Component<KeywordsProps> {
    render() {
        const { keywords, onTimeSelected, current_time } = this.props;
        if (keywords) {
            return (
                <div className="keywords">
                    {keywords.map((obj, index) => (
                        <Card key={index} sx={{ width: { xs: 200 } }}>
                            <CardContent>
                                {obj.data.map((d, s_index) => (
                                    <Chip
                                        key={s_index}
                                        color={(current_time || 0) > parseInt(obj.pos) ? "primary" : "default"}
                                        size="small"
                                        label={<Link
                                            target="_blank"
                                            href={d.url}
                                            underline="none"
                                            color="inherit">
                                            {d.title}
                                        </Link>} />
                                ))}
                            </CardContent>
                            <CardActions>
                                <Button
                                    onClick={() => onTimeSelected(parseInt(obj.pos))}>
                                    {secToReadable(obj.pos)}
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                    }
                </div >
            );
        } else {
            return (
                <div>
                    <p>Keywords not here...</p>
                    <CircularProgress size={60} color="inherit" />
                </div>
            );
        }
    }
}
