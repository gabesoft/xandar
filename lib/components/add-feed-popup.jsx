'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Popup = require('./popup.jsx');
const constants = require('../constants');
const dispatcher = require('../flux/dispatcher');
const Button = require('./icon-button.jsx');
const Loader = require('./loader.jsx');
const actions = require('../flux/feed-actions');

module.exports = class AddFeedPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      top: 0,
      left: 0,
      uri: null
    };
    this.close = this.close.bind(this);
    this.submit = this.submit.bind(this);
    this.onUriChange = this.onUriChange.bind(this);
  }

  submit() {
    if (this.state.uri) {
      // TODO: allow youtube channels
      this.setState({ loading: true });
      actions.findFeed(this.state.uri);
    }
  }

  close() {
    this.setState({ active: false });
  }

  onUriChange(event) {
    this.setState({ uri: event.target.value });
  }

  focusInput() {
    if (this.inputEl) {
      ReactDOM.findDOMNode(this.inputEl).focus();
    }
  }

  componentDidMount() {
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.feeds.SHOW_ADD_FEED_POPUP:
          this.setState({
            active: true,
            top: action.rect.top + 30,
            left: action.rect.left - 10,
            loading: false
          });
          this.focusInput();
          break;
        case constants.feeds.FIND_FEED_DONE:
          this.setState({ loading: false, uri: null });
          break;
        case constants.feeds.FIND_FEED_FAIL:
          this.setState({ loading: false });
          break;
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    dispatcher.unregister(this.tokenId);
  }

  render() {
    const input = (
      <input
        autoFocus
        className="uri-input"
        type="text"
        placeholder="Enter a feed url or youtube channel id"
        ref={el => this.inputEl = el}
        onChange={this.onUriChange}
        value={this.state.uri}
      />
    );
    const loader = (
      <Loader className="add-feed-popup-loader"/>
    );

    return (
      <Popup
        className="add-feed-popup"
        active={this.state.active}
        top={this.state.top}
        left={this.state.left}
        onClose={this.close}>
        <div className="header">
          <div className="title">Add a new feed</div>
        </div>
        <div className="content">
          {this.state.loading ? loader : input}
        </div>
        <div className="actions">
          <Button
            icon="check"
            size="large"
            title="Submit"
            color="green"
            onClick={this.submit}
          />
          <Button
            icon="close"
            size="large"
            title="Close"
            color="red"
            onClick={this.close}
          />
        </div>
      </Popup>
    );
  }
};
