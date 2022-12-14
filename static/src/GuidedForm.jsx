import React, { Fragment, useState, useEffect, useRef } from "react";

const GuidedForm = (props) => {
  const embracing = useRef();
  const resisting = useRef();

  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [prompt3, setPrompt3] = useState("");
  const [isEmbracing, setIsEmbracing] = useState();
  const [showPrompt2, setShowPrompt2] = useState(false);
  let entry = "";

  useEffect(() => {
    if (isEmbracing !== undefined){
      setShowPrompt2(true);
    }
  }, [isEmbracing]);

  useEffect(() => {
    props.getEntry(`${prompt1.trim()}\n\n${prompt2.trim()}\n\n${prompt3.trim()}`);

  }, [prompt1, prompt2, prompt3]);

  const getEmbracing = () => {
    setIsEmbracing(embracing.current.checked);
  };

  const getPrompt = (e, prompt, func) => {
    let input = '';

    if (e.target.value) {
      input = e.target.value.substring(0, 2) !== 'I ' ?
      e.target.value[0].toLowerCase() + e.target.value.substring(1) :
      e.target.value;
    }

    if (prompt === prompt1) {
      func(`I am feeling ${props.feeling} because ` + input);
    } else if (prompt === prompt2) {
      if (isEmbracing) {
        func('I am embracing this, so ' + input);
      } else {
        func('If I embraced this feeling, ' + input);
      }
    } else {
      func(e.target.value)
    }
  };

  // const submitPost = (e, entry) => {
  //   e.preventDefault();
  //   props.submitEntry(e, entry, isGuided);
  // }

  const checkKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.checked = !e.target.checked;
    }
  }

  const prompt1Key = props.feelingScore > 0 ? "helped" : "caused";
  const postureQuestion = isEmbracing
    ? "How do you think embracing these feelings is impacting this experience for you?"
    : "What would it feel like to embrace them?";

  return (
    <Fragment>
      <br />
      <label htmlFor="prompt1">
        What experience or event {prompt1Key} you to feel {props.feeling}?
        <br />
        <textarea
          id="prompt1"
          required
          onChange={(e) => getPrompt(e, prompt1, setPrompt1)}
        ></textarea>
      </label>

      <br />
      <br />

      {/* <label htmlFor="posture"> */}
        <span className="prompt">
          Are you embracing or resisting these feelings?
        </span>
      {/* </label> */}

      <br />

      <input
        type="radio"
        name="posture"
        value="embracing"
        id="embracing"
        ref={embracing}
        onChange={getEmbracing}
        onKeyDown={checkKey}
      />

      <label htmlFor="embracing">Embracing</label>

      <input
        type="radio"
        name="posture"
        value="resisting"
        id="resisting"
        ref={resisting}
        onChange={getEmbracing}
      />

      <label htmlFor="resisting">Resisting</label>

      <br />
      <br />

      {showPrompt2 && (
        <div id="guided-form-part2">
          <label htmlFor="prompt2">
            <span className="prompt">{postureQuestion}</span>
            <br />
            <textarea
              id="prompt2"
              required
              onChange={(e) => getPrompt(e, prompt2, setPrompt2)}
            ></textarea>
          </label>
          <br />
          <br />
          <label htmlFor="prompt3">
            <span className="prompt">
              What other insights or emotions would you like to share about this
              experience?
            </span>
            <br />
            <textarea
              id="prompt3"
              onChange={(e) => getPrompt(e, prompt3, setPrompt3)}
            ></textarea>
          </label>
        </div>
      )}

      <br />
      <br />

      {/* <button type="button" onClick={props.reset} >Cancel</button> */}
    </Fragment>
  );
};

// GuidedForm.defaultProps = {
//   feeling: { name: "creative", score: 6 },
// };

export default GuidedForm;
