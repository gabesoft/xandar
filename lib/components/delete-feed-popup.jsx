'use strict';

const React = require('react');
const Avatar = require('./text-avatar.jsx');
const Popup = require('./popup.jsx');
const constants = require('../constants');
const dispatcher = require('../flux/dispatcher');
const Button = require('./icon-button.jsx');
const Loader = require('./loader.jsx');
const actions = require('../flux/feed-actions');

module.exports = class DeleteFeedPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false, top: 0, left: 0 };
    this.close = this.close.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit() {
    this.setState({ loading: true });
    actions.deleteFeed(this.state.feed);
  }

  close() {
    this.setState({ active: false });
  }

  componentDidMount() {
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.feeds.SHOW_DELETE_FEED_POPUP:
          this.setState({
            active: true,
            loading: false,
            top: action.rect.top,
            left: action.rect.left,
            feed: action.feed
          });
          break;
        case constants.feeds.DELETE_FEED_DONE:
        case constants.feeds.DELETE_FEED_FAIL:
          this.setState({ loading: false, active: false });
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
    const loader = (<Loader className="add-feed-popup-loader"/>);
    const feed = this.state.feed || {};
    const subscription = feed.subscription || {};
    const title = subscription.title || feed.title || '';
    const message = (<h5>Are you sure you want to delete this feed?</h5>);

    return (
      <Popup
        className="delete-feed-popup"
        active={this.state.active}
        top={this.state.top}
        left={this.state.left}
        onClose={this.close}>
        <div className="header" onClick={this.close}>
          <Avatar text={title}/>
          <div className="title">{title.toLowerCase()}</div>
        </div>
        <div className="content">
          {this.state.loading ? loader : message}
        </div>
        <div className="actions">
          <Button
            icon="check"
            size="large"
            title="Ok"
            color="green"
            onClick={this.submit}
          />
          <Button
            icon="close"
            size="large"
            title="Cancel"
            color="red"
            onClick={this.close}
          />
        </div>
      </Popup>
    );
  }
};
