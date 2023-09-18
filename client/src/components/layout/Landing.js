import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const Landing = ({ auth: { isAuthenticated } }) => {
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Landing);
