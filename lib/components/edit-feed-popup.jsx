'use strict';

const React = require('react');
const Popup = require('./popup.jsx');
const constants = require('../constants');
const actions = require('../flux/feed-actions');
const dispatcher = require('../flux/dispatcher');
const Button = require('./icon-button.jsx');
const Avatar = require('./text-avatar.jsx');

module.exports = class AddFeedPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      top: 0,
      left: 0
    };
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ active: false });
    actions.editFeedPopupClosed({ feed: this.state.feed });
  }

  componentDidMount() {
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.feeds.SHOW_EDIT_FEED_POPUP:
          this.setState({
            active: true,
            feed: action.feed,
            top: action.rect.top + 30,
            left: action.rect.left - 10
          });
          break;
        case constants.feeds.HIDE_EDIT_FEED_POPUP:
          this.setState({ active: false });
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
    const feed = this.state.feed || {};
    const title = (feed.subscription || {}).title || feed.title || '';
    const subscribed = Boolean(feed.subscription);

    return (
      <Popup
        active={this.state.active}
        top={this.state.top}
        left={this.state.left}
        onClose={this.close}>
        <Avatar text={title} className={subscribed ? '' : 'invisible'}/>
        <div className="title">{title.toLowerCase()}</div>
        <div className="actions">
          <Button icon="close" color="red" onClick={this.close}/>
        </div>
      </Popup>
    );
  }
};
