'use strict';

const React = require('react');
const Popup = require('./popup.jsx');
const constants = require('../constants');
const dispatcher = require('../flux/dispatcher');
const Button = require('./icon-button.jsx');

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
  }

  componentDidMount() {
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.feeds.SHOW_ADD_FEED_POPUP:
          this.setState({
            active: true,
            top: action.rect.top + 30,
            left: action.rect.left - 10
          });
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
    return (
      <Popup
        active={this.state.active}
        top={this.state.top}
        left={this.state.left}
        onClose={this.close}>
        <Button icon="close" color="red" onClick={this.close}/>
        <div className="header">
          <span>Add a new feed</span>
        </div>
        <div className="content">
          <label htmlFor="href">RSS feed url or youtube channel id</label>
          <input name="" type="text" value=""/>
        </div>
        <div className="actions">

        </div>
      </Popup>
    );
  }
};
