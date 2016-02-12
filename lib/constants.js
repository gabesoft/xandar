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
    DELETE_DONE: 'feed-delete-done',
    DELETE_FAIL: 'feed-delete-fail',
    FIND_FEED_DONE: 'feed-find-done',
    FIND_FEED_FAIL: 'feed-find-fail',
    LOAD_FEEDS_DONE: 'feed-feeds-done',
    LOAD_FEEDS_FAIL: 'feed-feeds-fail',
    LOAD_POSTS_DONE: 'feed-posts-done',
    LOAD_POSTS_FAIL: 'feed-posts-fail',
    POST_COUNT: 5,
    SAVE_SUBSCRIPTION_DONE: 'feed-save-subscription-done',
    SAVE_SUBSCRIPTION_FAIL: 'feed-save-subscription-fail',
    STORE_CHANGE: 'feed-store-change',
    SUBSCRIBE_DONE: 'feed-subscribe-done',
    SUBSCRIBE_FAIL: 'feed-subscribe-fail',
    UNSUBSCRIBE_DONE: 'feed-unsubscribe-done',
    UNSUBSCRIBE_FAIL: 'feed-unsubscribe-fail'
  },

  posts: {
    CLOSE_TAG_POPUPS: 'post-close-tag-popups',
    CLOSED_ACTIVE_DELAY: 3000,
    EDIT_TAGS_TIMEOUT: 4000,
    POST_COUNT: 45,
    POST_SORT: ['post.date:desc'],
    ADD_POSTS_DONE: 'post-add-posts-done',
    ADD_POSTS_FAIL: 'post-add-posts-fail',
    LOAD_POSTS_DONE: 'post-load-posts-done',
    LOAD_POSTS_FAIL: 'post-load-posts-fail',
    SAVE_POST_DONE: 'post-save-post-done',
    SAVE_POST_FAIL: 'post-save-post-fail',
    STORE_CHANGE: 'post-store-change'
  },

  nav: {
    SEARCH: 'nav-search'
  },

  search: {
    LOAD_FEEDS_DONE: 'search-load-feeds-done',
    LOAD_FEEDS_FAIL: 'search-load-feeds-fail',
    LOAD_POST_QUERIES_DONE: 'search-load-post-queries-done',
    LOAD_POST_QUERIES_FAIL: 'search-load-post-queries-fail',
    POST_QUERY_COUNT: 25,
    POST_QUERY_SAVE_DELAY: 3500,
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
