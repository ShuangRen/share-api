import * as React from 'react';
import { Redirect } from "react-router-dom";


export default function redirectComponent(to: string) {
  class RedirectComponent extends React.Component {
    public render() {
      return (<Redirect to={to} />)
    }
  }

  return RedirectComponent;
}