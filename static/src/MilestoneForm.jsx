import React, { useState, useEffect, useRef, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoRemoveOutline, IoPencil } from "react-icons/io5";

import Quote from "./Quote.jsx";

const MilestoneForm = (props) => {
  const [haveMilestone, setHaveMilestone] = useState();
  const [title, setTitle] = useState();
  const [details, setDetails] = useState();

  const yes = useRef();
  const no = useRef();
  const milestoneText = useRef();

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (haveMilestone) {
  //     milestoneText.current.classList.remove("hide");
  //   } else if (no.current.checked) {
  //     navigate("/");
  //   }
  // }, [haveMilestone]);

  // const hasMilestone = (e) => {
  //   setHaveMilestone(yes.current.checked);
  // };

  const getInput = (e, method) => {
    method(e.target.value);
  };

  // const showQuote = () => {
  //   milestoneContainer.current.classList.add("hide");
  //   milestoneForm.current.reset();
  //   milestoneText.current.classList.add("hide");
  //   quoteContainer.current.classList.remove("hide");
  // };

  const saveMilestone = (e) => {
    e.preventDefault();
    props.submitMilestone(title, details);
    // showQuote();
  };

  return (
    <Fragment>
      <div id="milestone-container" >
        {/* <h3>Do you have any milestones to record?</h3> */}
        <form action="#" onSubmit={saveMilestone}>
          {/* <input
            type="radio"
            name="record-milestone"
            value="yes"
            id="milestone-yes"
            ref={yes}
            onChange={hasMilestone}
          />
          <label htmlFor="milestone-yes">yes</label>
          <input
            type="radio"
            name="record-milestone"
            value="no"
            id="no-milestone"
            ref={no}
            onChange={hasMilestone}
          />
          <label htmlFor="milestone-no">no</label> */}
          <br />
          <br />
          <div id="milestone-text" ref={milestoneText}>
            <label htmlFor="milestone-title">Milestone </label>
            <input
              type="text"
              name="milestone-title"
              id="milestone-title"
              maxLength="100"
              required
              onChange={(e) => getInput(e, setTitle)}
              // ref={title}
            />
            <br />
            <br />
            {/*<label htmlFor="milestone-details">
               Do you have any extra details to include?
            </label>
            <br />
            <textarea
              name="milestone-details"
              id="milestone-details"
              cols="30"
              rows="3"
              onChange={(e) => getInput(e, setDetails)}
              // ref={details}
            ></textarea>
            <br />
            <br /> */}
            <button type="button" onClick={() => navigate("/")} >Cancel</button>
            <input type="submit" value="Save Milestone" />
          </div>
        </form>
      </div>
      {/* <div id="quote-wrapper" className="hide" >
        <Quote getQuote={props.getQuote} /> */}
        {/* <a href="#">Add an entry</a>
        <a href="#">Add a milestone</a> */}
      {/* </div> */}
    </Fragment>
  );
};

export default MilestoneForm;