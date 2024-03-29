import React, { useEffect, useState } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import {
  Route,
  Routes,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Greet from "./Greet.jsx";
import Message from "./Message.jsx";
import Feelings from "./Feelings.jsx";
import Entry from "./Entry.jsx";
import Hub from "./Hub.jsx";
import MilestoneForm from "./MilestoneForm.jsx";
import Quote from "./Quote.jsx";

const Home = ({ user, email, showAlert }) => {
  const [feeling, setFeeling] = useState(sessionStorage.getItem("feeling"));
  const [feelingScore, setFeelingScore] = useState();
  const [posts, setPosts] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [userMsg, setUserMsg] = useState();
  const [userMsgQuestion, setUserMsgQuestion] = useState(false);
  const [userMsgPath, setUserMsgPath] = useState();
  const [userMsgLinkText, setUserMsgLinkText] = useState();
  const [sendToEntry, setSendToEntry] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const emotionColors = {
    happy: "#ffd07380",
    anticipation: "#ffb6bd7e",
    surprised: "#fffa947e",
    bad: "#44a5ff78",
    fearful: "#cda7e781",
    angry: "#ed6b5a7e",
    disgust: "#96e7b680",
    sad: "#85d5e97b",
  };

  const userId = sessionStorage.getItem("userId");

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  useEffect(() => {
    getPosts(userId);
    getMilestones(user);
    checkMsgStatus();
  }, []);

  useEffect(() => {
    getPosts(userId);
    checkMsgStatus();
  }, [user]);

  useEffect(() => {
    checkMsgStatus();
  }, [feeling]);

  /******** USER MESSAGES *********/

  const changeMsg = (
    msg,
    hasQuestion = false,
    path = "/",
    linkText = " yes"
  ) => {
    setUserMsg(msg);
    setUserMsgQuestion(hasQuestion);
    setUserMsgLinkText(linkText);
    setUserMsgPath(path);
  };

  const checkMsgStatus = () => {
    if (user && sessionStorage.getItem("trend")) {
      changeMsg(" ");
    }

    if (
      sessionStorage.getItem("milestone") &&
      !sessionStorage.getItem("trend")
    ) {
      changeMsg("check out your trends");
    }

    if (
      sessionStorage.getItem("entry") &&
      !sessionStorage.getItem("milestone")
    ) {
      changeMsg("do you have a milestone to record?", true, "/milestone");
    }

    if (feeling && !sessionStorage.getItem("entry")) {
      changeMsg("would you like to write about it? ", true, "/entry");
    }

    if (user && !feeling) {
      changeMsg("how are you feeling?");
    }

    if (!user) {
      changeMsg("create an account or login to get started");
    }
  };

  /********** FEELINGS ***********/

  const getFeeling = (f) => {
    axios.get(`/third_emotion/${f}`).then((results) => {
      changeMsg("Would like to write about it? ", true, "/entry");
      setFeeling(results.data.name);
      setFeelingScore(results.data.score);
      if (sendToEntry) navigate("/entry");
    });
  };

  const sendFeeling = (feeling) => {
    setFeeling(feeling);
  };

  /********** POST ENTRY ***********/

  const showHome = (el) => {
    navigate("/");
  };

  const getPosts = (userId) => {
    if (userId) {
      axios
        .get(`/posts/${userId}`)
        .then((results) => {
          setPosts(results.data);
          checkMsgStatus();
        })
        .catch((err) => console.log(''));
    } else {
      setPosts([]);
    }
  };

  const submitEntry = (entry, guided) => {
    const post = {
      user: user,
      email: email,
      date: DateTime.now().toISO(),
      entry: entry,
      guided: guided
    };

    axios
      .post("/posts", post, config)
      .then((results) => {
        sessionStorage.setItem("entry", true);
        getPosts(userId);
        setSendToEntry(false);
        navigate("/");
      })
      .catch((err) => console.log(''));
  };

  const updateEntry = (id, newEntry) => {
    const entry = { newEntry };

    axios
      .put(`/posts/update/${id}`, entry, config)
      .then((res) => {
        getPosts(userId);
      })
      .catch((err) => showAlert(err.response.data.msg));
  };

  /********** JOURNAL ***********/

  const deletePost = (id) => {
    // const data = { data: { id } }
    axios
      .delete(`/posts/delete/${id}`)
      .then((results) => {
        getPosts(userId);
      })
      .catch((err) => console.log(''));
  };

  /********** MILESTONES ***********/

  const getMilestones = (name) => {
    if (name) {
      axios
        .get(`/milestones/${name}`)
        .then((results) => setMilestones(results.data))
        .catch((err) => console.log(''));
    } else {
      setMilestones([]);
    }
  };

  const submitMilestone = (title) => {
    axios
      .post(`/milestones/${email}`, { title }, config)
      .then((res) => {
        sessionStorage.setItem("milestone", true);
        getMilestones(user);
        navigate("/hub-milestones");
      })
      .catch((err) => console.log(''));
  };

  const updateMilestone = (id, text) => {
    axios
      .put(`/milestone/${id}`, { text }, config)
      .then((res) => {
        getMilestones(user);
      })
      .catch((err) => console.log(''));
  };

  const deleteMilestone = (id) => {
    axios
      .delete(`/milestone/${id}`)
      .then((res) => {
        getMilestones(user);
      })
      .catch((err) => console.log(''));
  };

  /********** QUOTES ***********/
  const getQuote = async (keyword = "inspirational") => {
    return await axios
      .get(`/quote/${keyword}`)
      .then((res) => res.data)
      .catch((err) => console.log(''));
  };

  const getQuote2 = async () => {
    try {
      return await axios.get("/new-quote", config);
    } catch (err) {
      console.log('');
    }
  };

  /********** USER SESSIONS ***********/
  const getUserSessions = async (userId) => {
    try {
      return await axios.get(`/sessions/${userId}`);
    } catch (err) {
      return {data: []}
    }
  };

  return (
    <div id="home-container" className="mt-3">
      <div
        id="home-all"
        className="row justify-content-evenly justify-content-lg-around gx-2 gx-lg-0 mx-lg-5"
      >
        <div
          id="home-main"
          className="col-12 col-md-5 col-lg-4 mt-0 mt-md-5 ms-md-3 ms-lg-4"
        >
          {(location.pathname.includes("hub") || location.pathname === "/") && (
            <div
              id="msg-center"
              className="p-3 ps-1 ps-lg-2 mt-5 mt-md-3 mx-auto shadow-sm rounded"
            >
              <div id="greet-wrapper" className="fs-5 my-1 pe-md-5 pe-lg-1">
                <Greet
                  feeling={feeling}
                  user={user}
                  sendFeeling={setFeeling}
                  checkMsgStatus={checkMsgStatus}
                />
              </div>
              <div
                id="user-msg-wrapper"
                className="my-1 fs-6 fs-5 ps-3 text-center text-md-start"
              >
                {userMsg && (
                  <Message
                    msg={userMsg}
                    hasQuestion={userMsgQuestion}
                    linkText={userMsgLinkText}
                    path={userMsgPath}
                  />
                )}
              </div>
            </div>
          )}
          {(location.pathname.includes("hub") || location.pathname === "/") &&
            user &&
            !feeling && (
              <Feelings
                user={user}
                feeling={getFeeling}
              />
            )}
          {(location.pathname.includes("hub") || location.pathname === "/") &&
            feeling && <Quote getQuote={getQuote2} />}
        </div>
        {(location.pathname.includes("hub") || location.pathname === "/") && (
          <div
            id="hub-wrapper"
            className="col-12 col-md-5 mb-5 mx-5 ms-md-0 me-md-5 shadow rounded"
          >
            <Hub
              feeling={feeling}
              posts={posts}
              milestones={milestones}
              emotionColors={emotionColors}
              checkMsgStatus={checkMsgStatus}
              changeMsg={changeMsg}
              deletePost={deletePost}
              updateEntry={updateEntry}
              updateMilestone={updateMilestone}
              deleteMilestone={deleteMilestone}
              getUserSessions={getUserSessions}
              setSendToEntry={setSendToEntry}
            />
          </div>
        )}
      </div>

      <Routes>
        <Route
          path="/feelings"
          element={
            <Feelings
              user={user}
              colors={emotionColors}
              feeling={getFeeling}
              showAlert={showAlert}
            />
          }
        />
        <Route
          path="/entry/*"
          element={
            <Entry
              feeling={feeling}
              feelingScore={feelingScore}
              submitEntry={submitEntry}
              setSendToEntry={setSendToEntry}
              checkMsgStatus={checkMsgStatus}
            />
          }
        />
        <Route
          path="/milestone"
          element={
            <MilestoneForm
              getQuote={getQuote2}
              submitMilestone={submitMilestone}
              checkMsgStatus={checkMsgStatus}
            />
          }
        />
        <Route path="/quote" element={<Quote />} />
      </Routes>
    </div>
  );
};

export default Home;
