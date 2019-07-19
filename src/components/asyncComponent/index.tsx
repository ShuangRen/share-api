import * as React from 'react';

interface IState {
  component: React.ComponentClass | React.StatelessComponent | null
}

export default function asyncComponent(importComponent: any) {
  class AsyncComponent extends React.Component<{}, IState> {
    constructor(props: {}) {
      super(props);

      this.state = {
        component: null
      };
    }

    public async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component,
      });
    }


    public componentWillUnmount() {
      this.setState = () => {
        return;
      };
    }

    public render() {
      if (!this.state.component) {
        return null;
      }
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}
