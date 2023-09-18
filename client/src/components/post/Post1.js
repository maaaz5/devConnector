import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { getPost } from "../../actions/post";
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";
import CommentItem from "./CommentItem";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import CommentFourm from "./CommentFourm";

const Post1 = ({ getPost, post: { loading, post } }) => {
  const params = useParams();
  const id = params.id;
  useEffect(() => {
    getPost(id);
  }, [id, getPost]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn ">
        Back To Posts
      </Link>
      <PostItem showActions={false} post={post} />
      <CommentFourm postId={post._id} />
      <div className="comments">
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post1.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  post: state.post,
});
export default connect(mapStateToProps, { getPost })(Post1);
