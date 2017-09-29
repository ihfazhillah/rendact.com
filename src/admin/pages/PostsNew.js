import React from 'react';
import NewContentType from '../lib/ContentTypeNew';
import Query from '../query';

let NewPost = React.createClass({
  render: function() {
    return <NewContentType 
      name="Post"
      slug="posts" 
      postType="post"
      postId={this.props.postId} 
      tableName="Post"
      widgets={["category", "tag", "featuredImage", "imageGallery"]}
      viewRole="view-post"
      modifyRole="modify-post"
      handleNav={this.props.handleNav}
      handleUnsavedData={this.props.handleUnsavedData}
      urlParams={this.props.urlParams}
    />
  }
});

export default NewPost;
