import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";

const About = () => (
  <div
    id="about-container"
    className="container-fluid rounded ps-2 pe-3 pe-lg-4 pb-5"
  >
    <h2
      id="about-title"
      className="position-sticky display-6 pt-5 pb-2 ps-3 ps-md-5"
    >
      <Link to="/">
        <span id="about-close">
          <AiOutlineClose />
        </span>
      </Link>
      how to use thoughtflow
    </h2>
    <ol className="lead ms-4 ms-md-5 px-1 px-md-2">
      <li>Pinpoint the emotion that you are feeling</li>
      <li>Choose if you would like guided prompts</li>
      <li>
        Explore the emotion by writing about:
        <ul className="ms-5 ps-2 p-1 pb-2">
          <li>Experiences that made you feel this</li>
          <li>How it is affecting you</li>
          <li>Different approaches to navigating this experience</li>
        </ul>
      </li>
      <li>
        Record milestones to recognize and record breakthroughs and
        accomplishments you achieve while working through emotions
      </li>
    </ol>
    <h2 className="display-6 my-1 ps-3 ps-md-5">why this works</h2>
    <p className="lead ms-4 ms-md-5 px-1 px-md-2">
      Exploring and studing your feelings through journaling is a Congnitive
      Behavioral Therapy(CBT) technique used to give patients an effective way
      to cope with overwhelming emotions. The regular practice of keeping a
      Thought Journal can help you to identify patterns and triggers that lead
      to reoccuring emotions.
    </p>
    <div id="about-footer" className="ms-4 ms-md-5 px-1 px-md-2">
      To learn more about CBT, see this{" "}
      <a
        href="https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral"
        target="_blank"
        className="ext-link"
      >
        article
      </a>{" "}
      from the APA.
    </div>
  </div>
);

export default About;
