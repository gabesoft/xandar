const React = require('react');
const TagsInput = require('react-tagsinput');
const Awesomplete = require('awesomplete');
const actions = require('../flux/tag-actions');
const store = require('../flux/tag-store');
const tc = require('../tag-constants');

module.exports = class AutocompleteTagsInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: store.getTags() };
    this.onTagsChange = this.onTagsChange.bind(this);
    this.initAwesomplete = this.initAwesomplete.bind(this);
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  onTagsChange(tags) {
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
    if (this.state.tags.length === 0) {
      actions.loadTags();
    }
  }

  componentWillUnmount() {
    store.removeListener(tc.STORE_CHANGE, this.onStoreChange);
    this.state.inputInitialized = false;
    this.awesomplete = null;
  }

  renderTag(props) {
    const {tag, key, onRemove} = props;
    return (
      <div key={key} className="react-tagsinput-tag" props>
        {tag}
        <i onClick={() => onRemove(key)} className="material-icons">
          close
        </i>
      </div>
    );
  }

  initAwesomplete(cmp) {
    if (cmp !== null && !this.state.inputInitialized) {
      const input = cmp.refs.input;
      const awesomplete = new Awesomplete(input);
      const $ = Awesomplete.$;

      const replace = function replace(text) {
        const value = (text || '').replace(/^close\s+/, '');
        this.input.value = value;
        return value;
      };

      const item = (text, search) => {
        const value = text.replace(RegExp($.regExpEscape(search.trim()), 'gi'), '<mark>$&</mark>');
        const close = '<i class="material-icons">close</i>';
        return $.create('li', {
          innerHTML: `${close} ${value}`,
          'aria-selected': false
        });
      };

      this.state.inputInitialized = true;

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
          cmp.setState({tag: value});
        }
      });

      this.awesomplete = awesomplete;
    }
  }

  render() {
    return (
      <TagsInput
        ref={this.initAwesomplete}
        value={this.props.tags}
        renderTag={this.renderTag}
        addKeys={[9, 13, 32]}
        onChange={this.onTagsChange}/>
    );
  }
};

