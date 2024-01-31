import React, { Component } from 'react';

// TODO this beter
function logErrorToMyService(error, info) {
    console.error('An error occurred:', error);
    console.error('With additional info:', info);
  }
  
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(error, info);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <h1>App is currently under maintenance. Check back later.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
