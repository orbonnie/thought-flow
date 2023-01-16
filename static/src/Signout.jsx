import React from "react";

const Signout = (props) => {
  const signoutUser = () => {
    props.clear();
    props.cancelForm();
  };

  return (
    <div id="signout-container" className="container border shadow rounded text-center">
    <form id="signout-form" className="form-group p-5">
      <h3>Do you want to sign out?</h3>
      <div id="signout-btn-div" className="form-btn-div">
        <button type="button" className="form-btn btn border" onClick={props.cancelForm} value="Cancel">
          Cancel
        </button>
        <button type="button" value="Sign Out" className="form-btn btn border" onClick={signoutUser}>
          Sign Out
        </button>
      </div>
    </form>
    </div>
  );
};

export default Signout;
