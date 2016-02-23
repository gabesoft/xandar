const React = require('react');
const ReactServer = require('react-dom/server');
const TagsInput = require('react-tagsinput');
const Awesomplete = require('awesomplete');
const actions = require('../flux/tag-actions');
const store = require('../flux/tag-store');
const tc = require('../constants').tags;
const Item = require('./tag-item.jsx');
const itemFactory = React.createFactory(Item);
const Button = require('./icon-button.jsx');
const cls = require('../util').cls;

module.exports = class AutocompleteTagsInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: store.getTags(), value: props.tags };
    this.onTagsChange = this.onTagsChange.bind(this);
    this.initAwesomplete = this.initAwesomplete.bind(this);
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onFocus(event) {
    this.setState({ focused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  onBlur(event) {
    this.setState({ focused: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  onTagsChange(tags) {
    this.setState({ value: tags });
    this.props.onChange(tags);
    if (store.anyNew(tags)) {
      actions.saveTags(tags);
    }
  }

  onStoreChange() {
    this.setState({ tags: store.getTags() });
    if (this.awesomplete) {
      this.awesomplete.list = this.state.tags;
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ value: props.tags });
  }

  componentDidMount() {
    store.addListener(tc.STORE_CHANGE, this.onStoreChange);
  }

  componentWillUnmount() {
    store.removeListener(tc.STORE_CHANGE, this.onStoreChange);
    this.awesompleteInitialized = false;
    this.awesomplete = null;
  }

  // TODO extract tag into a component
  // TODO: make selection with the mouse in awesomplete work
  renderTag(props) {
    const { tag, key, onRemove } = props;
    return (
      <div key={key} className="tag-item" props>
        <div className="content">
          <span className="tag-name">{tag}</span>
          <Button
            icon="delete"
            color="red"
            title="Delete tag"
            size="xsmall"
            onClick={() => onRemove(key)}
          />
        </div>
      </div>
    );
  }

  initAwesomplete(el) {
    if (el !== null && !this.awesompleteInitialized) {
      const input = el.refs.input;
      const awesomplete = new Awesomplete(input);
      const $ = Awesomplete.$;

      awesomplete.replace = text => {
        const value = (text || '').replace(/\s*close\s*$/, '');
        input.value = value;
        return value;
      };

      awesomplete.item = (text, search) => {
        const value = RegExp($.regExpEscape(search.trim()), 'gi');
        const item = itemFactory({ value: text.replace(value, '<mark>$&</mark>') });
        const html = ReactServer.renderToString(item);
        return $.create('div', { innerHTML: html }).firstChild;
      };

      awesomplete.list = this.state.tags;
      awesomplete.autoFirst = true;

      this.awesompleteInitialized = true;

      input.addEventListener('awesomplete-select', event => {
        const value = awesomplete.replace(event.text);
        const target = (event.originalEvent || {}).target || {};
        if (target.tagName === 'I') {
          actions.deleteTag(value);
        } else {
          el.setState({ tag: value });
          input.value = value;
          input.focus();
        }
      });

      input.addEventListener('awesomplete-selectcomplete', () => {
        el.setState({ tag: input.value });
        setTimeout(input.focus.bind(input), 0);
      });

      this.awesomplete = awesomplete;
    }
  }

  onKeyDown(event) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  render() {
    const className = cls(
      this.props.className,
      this.state.focused ? 'focused' : null);

    return (
      <TagsInput
        ref={this.initAwesomplete}
        id={this.props.id}
        value={this.state.value}
        renderTag={this.renderTag}
        addKeys={[9, 13, 32]}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={this.onTagsChange}
        onKeyDown={this.onKeyDown}
        className={className}
      />
    );
  }
};
