'use strict';

import React from 'react';
import {
    View,
    WebView,
    PropTypes
  } from 'react-native'

import BaseComponent from './BaseComponent'
import Utils from './Utils'
import Spinner from 'react-native-loading-spinner-overlay';

import styles from './styles'

import StatusBar from './StatusBar'
import AddressBar from './AddressBar'
import Toolbar from './Toolbar'

const WEBVIEW_REF = 'webview';

const propTypes = {
    url: React.PropTypes.string,
    hideToolbar: React.PropTypes.bool,
    hideAddressBar: React.PropTypes.bool,
    hideStatusBar: React.PropTypes.bool,
    hideHomeButton: React.PropTypes.bool,
    hideActivityIndicator: React.PropTypes.bool,
    foregroundColor: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    onNavigationStateChange: React.PropTypes.func,
    onShouldStartLoadWithRequest: React.PropTypes.func
}

const defaultProps = {
    url: '',
    hideToolbar: false,
    hideAddressBar: false,
    hideStatusBar: false,
    hideHomeButton: false,
    hideActivityIndicator: false,
    onNavigationStateChange: ()=>{},
    onShouldStartLoadWithRequest: ()=>true,
}

class Webbrowser extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            status: '',
            currentUrl: Utils.sanitizeUrl(this.props.url),
            url: Utils.sanitizeUrl(this.props.url),
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            homeButtonEnabled: true,
            loading: true,
            scalesPageToFit: true,
        };

        this._bind(
            'render',
            'goBack',
            'goHome',
            'goForward',
            'reload',
            'onNavigationStateChange',
            'onShouldStartLoadWithRequest',
            'renderToolbar'
        );
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            url: Utils.sanitizeUrl(nextProps.url)
        });
    }

    renderAddressBar() {

        if (this.props.hideAddressBar) {
            return;
        };

        return <AddressBar
            onReload={this.reload}
            onLoad={(url)=>{this.load(url)}}
            url={this.state.currentUrl}
            foregroundColor={this.props.foregroundColor}
        />
    }

    renderStatusBar() {

        if (this.props.hideStatusBar) {
            return;
        };

        return <StatusBar
            status={this.state.status}
            foregroundColor={this.props.foregroundColor}
        />
    }

    renderToolbar() {

        if (this.props.hideToolbar) {
            return;
        };

        return <Toolbar
            onBack={this.goBack}
            onHome={this.goHome}
            onForward={this.goForward}
            backButtonEnabled={this.state.backButtonEnabled}
            forwardButtonEnabled={this.state.forwardButtonEnabled}
            hideHomeButton={this.props.hideHomeButton}
            foregroundColor={this.props.foregroundColor}
        />;
    }

    render() {
        return (
            <View style={[styles.container, this.props.backgroundColor && {backgroundColor: this.props.backgroundColor}]}>
                <View style={styles.header}>
                    {this.renderAddressBar()}
                    {this.renderStatusBar()}
                </View>
                <WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{uri: this.state.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onNavigationStateChange={this.onNavigationStateChange}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    startInLoadingState={true}
                    scalesPageToFit={this.state.scalesPageToFit}
                />
                {this.renderToolbar()}
                <Spinner visible={this.state.loading} />
            </View>
        );
    }

    goBack() {
        this.refs[WEBVIEW_REF].goBack();
    }

    goForward() {
        this.refs[WEBVIEW_REF].goForward();
    }

    goHome() {
        this.load(this.props.url);
    }

    load(url) {
        this.setState({
            url
        });
    }

    reload() {
        this.refs[WEBVIEW_REF].reload();
    }

    onShouldStartLoadWithRequest(event) {
        return this.props.onShouldStartLoadWithRequest(event);
    }

    onNavigationStateChange(navState) {

        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            currentUrl: navState.url,
            status: navState.title,
            loading: navState.loading,
            scalesPageToFit: true
        });

        this.props.onNavigationStateChange(navState);
    }
};

Webbrowser.propTypes = propTypes;
Webbrowser.defaultProps = defaultProps;

export default Webbrowser;
