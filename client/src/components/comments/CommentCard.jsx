import React from 'react';
import CommentItem from './CommentItem';

// Re-export / alias CommentItem as CommentCard for architectural consistency
export const CommentCard = (props) => {
  return <CommentItem {...props} />;
};

export default CommentCard;
