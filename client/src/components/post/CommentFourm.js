import React, { useState } from "react";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";

import PropTypes from "prop-types";

const CommentFourm = ({ postId, addComment }) => {
  const [text, setText] = useState("");

  return (
    <div
      className="post-form"
      onSubmit={(e) => {
        e.preventDefault();
        addComment(postId, { text });
        setText("");
      }}
    >
      <div className="bg-primary p">
        <h3>Leave A Comment</h3>
      </div>
      <form className="form my-1">
        <textarea
          name="text"
          cols="30"
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Comment on this post"
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CommentFourm.propTypes = { addComment: PropTypes.func.isRequired };

export default connect(null, { addComment })(CommentFourm);
