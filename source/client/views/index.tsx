import * as React from "react";

interface IRootProps {
    store: any;
}

export class Root extends React.Component<IRootProps, {}> {
    public render() {
        return <div>Root Components</div>;
    }
}
