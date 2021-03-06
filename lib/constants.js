module.exports = {
  STORE_MAX_LISTENERS: 500,

  tags: {
    DELETE_TAG_DONE: 'tags-delete-tag-done',
    DELETE_TAG_FAIL: 'tags-delete-tag-fail',
    LOAD_TAGS_DONE: 'tags-load-tags-done',
    LOAD_TAGS_FAIL: 'tags-load-tags-fail',
    SAVE_TAGS_DONE: 'tags-save-tags-done',
    SAVE_TAGS_FAIL: 'tags-save-tags-fail',
    STORE_CHANGE: 'tag-store-change'
  },

  feeds: {
    ADDED_ACTIVE_DELAY: 5000,
    DELETE_FEED_DONE: 'feeds-feed-delete-done',
    DELETE_FEED_FAIL: 'feeds-feed-delete-fail',
    ADD_FEED_DONE: 'feeds-add-feed-done',
    ADD_FEED_FAIL: 'feeds-add-feed-fail',
    LOAD_FEEDS_DONE: 'feeds-feeds-done',
    LOAD_FEEDS_FAIL: 'feeds-feeds-fail',
    LOAD_POSTS_DONE: 'feeds-posts-done',
    LOAD_POSTS_FAIL: 'feeds-posts-fail',
    MARK_POSTS_AS_READ_DONE: 'feeds-mark-posts-as-read-done',
    MARK_POSTS_AS_READ_FAIL: 'feeds-mark-posts-as-read-fail',
    POST_COUNT: 5,
    SAVE_SUBSCRIPTION_DONE: 'feeds-save-subscription-done',
    SAVE_SUBSCRIPTION_FAIL: 'feeds-save-subscription-fail',
    STORE_CHANGE: 'feeds-store-change',
    SUBSCRIBE_DONE: 'feeds-subscribe-done',
    SUBSCRIBE_FAIL: 'feeds-subscribe-fail',
    UNSUBSCRIBE_DONE: 'feeds-unsubscribe-done',
    UNSUBSCRIBE_FAIL: 'feeds-unsubscribe-fail',
    SHOW_ADD_FEED_POPUP: 'feeds-show-add-feed-popup',
    HIDE_ADD_FEED_POPUP: 'feeds-hide-add-feed-popup',
    SHOW_EDIT_FEED_POPUP: 'feeds-show-edit-feed-popup',
    HIDE_EDIT_FEED_POPUP: 'feeds-hide_edit_feed_popup',
    SHOW_DELETE_FEED_POPUP: 'feeds-show-delete-feed-popup',
    HIDE_DELETE_FEED_POPUP: 'feeds-hide_delete_feed_popup',
    EDIT_FEED_POPUP_CLOSED: 'feeds-edit-feed-popup-closed'
  },

  posts: {
    CLOSE_TAG_POPUPS: 'posts-close-tag-popups',
    CLOSED_ACTIVE_DELAY: 3000,
    EDIT_TAGS_TIMEOUT: 4000,
    POST_COUNT: 60,
    LOAD_THRESHOLD: 0.70,
    POST_SORT: '-post.date',
    ADD_POSTS_START: 'posts-add-posts-start',
    ADD_POSTS_DONE: 'posts-add-posts-done',
    ADD_POSTS_FAIL: 'posts-add-posts-fail',
    LOAD_POSTS_START: 'posts-load-posts-start',
    LOAD_POSTS_DONE: 'posts-load-posts-done',
    LOAD_POSTS_FAIL: 'posts-load-posts-fail',
    SAVE_POST_DONE: 'posts-save-post-done',
    SAVE_POST_FAIL: 'posts-save-post-fail',
    STORE_CHANGE: 'posts-store-change',
    UPDATE_READ_STATUS: 'posts-update-read-status',
    SHOW_EDIT_POST_POPUP: 'posts-show-edit-post-popup',
    HIDE_EDIT_POST_POPUP: 'posts-hide_edit_post_popup',
    EDIT_POST_POPUP_CLOSED: 'posts-edit-post-popup-closed',
    CAROUSEL_AT_TOP: 'posts-carousel-at-top',
    CAROUSEL_AT_END: 'posts-carousel-at-end'
  },

  nav: {
    SEARCH: 'nav-search'
  },

  search: {
    LOAD_FEEDS_DONE: 'search-load-feeds-done',
    LOAD_FEEDS_FAIL: 'search-load-feeds-fail',
    LOAD_POST_QUERIES_DONE: 'search-load-post-queries-done',
    LOAD_POST_QUERIES_FAIL: 'search-load-post-queries-fail',
    POST_QUERY_COUNT: 40,
    POST_QUERY_SAVE_DELAY: 4500,
    POST_QUERY_HIGHLIGHT_DELAY: 2500,
    SAVE_POST_QUERY_DONE: 'search-save_post_query_done',
    SAVE_POST_QUERY_FAIL: 'search-save_post_query_fail',
    SEARCH_NAV_LOADING_START: 'search-nav-loading-start',
    SEARCH_NAV_LOADING_STOP: 'search-nav-loading-stop',
    STORE_CHANGE: 'search-store-change',
    UPDATE_QUERY_SEARCH: 'search-update-query-search',
    CLEAR_QUERY_SEARCH: 'search-clear-query-search',
    SELECT_POST_QUERY: 'search-select-post-query'
  }
};
