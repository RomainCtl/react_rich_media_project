import React from "react";
import { Box } from "@material-ui/core";

type TabPanelProps = {
    children?: React.ReactNode;
    index: any;
    value: any;
}

export class TabPanel extends React.Component<TabPanelProps> {
    render() {
        const { value, index, children } = this.props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}>
                {value === index && (
                    <Box p={3}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }
}