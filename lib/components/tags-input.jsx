const React = require('react');
const TagsInput = require('react-tagsinput');
const Awesomplete = require('awesomplete');
const actions = require('../flux/tag-actions');
const store = require('../flux/tag-store');
const tc = require('../constants').tags;

module.exports = class AutocompleteTagsInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: store.getTags(), value: props.tags };
    this.onTagsChange = this.onTagsChange.bind(this);
    this.initAwesomplete = this.initAwesomplete.bind(this);
    this.onStoreChange = this.onStoreChange.bind(this);
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

  componentDidMount() {
    store.addListener(tc.STORE_CHANGE, this.onStoreChange);
  }

  componentWillUnmount() {
    store.removeListener(tc.STORE_CHANGE, this.onStoreChange);
    this.awesompleteInitialized = false;
    this.awesomplete = null;
  }

  renderTag(props) {
    const { tag, key, onRemove } = props;
    return (
      <div key={key} className="react-tagsinput-tag" props>
        {tag}
        <i onClick={() => onRemove(key)} className="material-icons">
          close
        </i>
      </div>
    );
  }

  initAwesomplete(el) {
    if (el !== null && !this.awesompleteInitialized) {
      const input = el.refs.input;
      const awesomplete = new Awesomplete(input);
      const $ = Awesomplete.$;

      const replace = function replace(text) {
        const value = (text || '').replace(/\s+close\s*$/, '');
        this.input.value = value;
        return value;
      };

      const item = (text, search) => {
        const value = RegExp($.regExpEscape(search.trim()), 'gi');
        const valueHtml = text.replace(value, '<mark>$&</mark>');
        const close = '<i class="material-icons">close</i>';
        return $.create('li', {
          innerHTML: `<span>${valueHtml}</span> ${close}`,
          'aria-selected': false
        });
      };

      this.awesompleteInitialized = true;

      awesomplete.list = this.state.tags;
      awesomplete.replace = replace;
      awesomplete.item = item;
      awesomplete.autoFirst = true;

      input.addEventListener('awesomplete-select', event => {
        const value = awesomplete.replace(event.text);
        const target = (event.originalEvent || {}).target || {};
        if (target.tagName === 'I') {
          actions.deleteTag(value);
        } else {
          input.value = value;
          el.setState({ tag: value });
        }
      });

      this.awesomplete = awesomplete;
    }
  }

  render() {
    return (
      <TagsInput
        ref={this.initAwesomplete}
        id={this.props.id}
        value={this.state.value}
        renderTag={this.renderTag}
        addKeys={[9, 13, 32]}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onChange={this.onTagsChange}
      />
    );
  }
};
