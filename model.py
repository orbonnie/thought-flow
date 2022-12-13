"""Models for thought flow app."""

from unicodedata import category
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """A user"""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(30), nullable=False)


    posts = db.relationship("Post", back_populates="user")
    milestones = db.relationship("Milestone", back_populates="user")
    user_sessions = db.relationship("UserSession", back_populates="user")

    def __repr__(self):
        return f"<User id={self.id} name={self.name}>"


class BaseEmotion(db.Model):
    """A general emotion identified by the user"""

    __tablename__ = "base_emotions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    score = db.Column(db.Integer, nullable=False)

    second_emotions = db.relationship("SecondEmotion", back_populates="base_emotion")
    user_sessions = db.relationship("UserSession", back_populates="base_emotion")


    def __repr__(self):
        return f"<BaseEmotion id={self.id} name={self.name}>"


class SecondEmotion(db.Model):
    """A more specific emotion identified by the user"""

    __tablename__ = "second_emotions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    base_emotion_id = db.Column(db.Integer,
                                db.ForeignKey('base_emotions.id'),
                                nullable=False)

    base_emotion = db.relationship("BaseEmotion", back_populates="second_emotions")
    third_emotions = db.relationship("ThirdEmotion", back_populates="second_emotion")
    user_sessions = db.relationship("UserSession", back_populates="second_emotion")


    def __repr__(self):
        return f"<SecondEmotion id={self.id} name={self.name}>"


class ThirdEmotion(db.Model):
    """A nuanced emotion identified by the user"""

    __tablename__ = "third_emotions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    second_emotion_id = db.Column(db.Integer,
                                  db.ForeignKey('second_emotions.id'),
                                  nullable=False)

    second_emotion = db.relationship("SecondEmotion", back_populates="third_emotions")
    user_sessions = db.relationship("UserSession", back_populates="third_emotion")


    def __repr__(self):
        return f"<BaseEmotion id={self.id} name={self.name}>"


class Post(db.Model):
    """A journal entry from the user"""

    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.String, nullable=False)
    entry = db.Column(db.Text, nullable=False)
    guided = db.Column(db.Boolean, nullable=False)

    user = db.relationship("User", back_populates="posts")
    user_session = db.relationship("UserSession", back_populates="post")

    def __repr__(self):
        return f"<Post id={self.id} name={self.date}>"


class Milestone(db.Model):
    """Progress reported by the user"""

    __tablename__ = "milestones"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    msg = db.Column(db.Text, nullable=False)

    user = db.relationship("User", back_populates="milestones")
    user_session = db.relationship("UserSession", back_populates="milestone")

    def __repr__(self):
        return f"<Milestone id={self.id} name={self.title}>"


class Prompt(db.Model):
    """A guiding prompt for the user"""

    __tablename__ = "prompts"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    level = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(30), nullable=False)
    msg = db.Column(db.String(250), nullable=False)

    def __repr__(self):
        return f"<Prompt id={self.id}>"


class UserSession(db.Model):
    """Emotions identified by the user during session"""

    __tablename__ = "user_sessions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    base_emotion_id = db.Column(db.Integer, db.ForeignKey('base_emotions.id'))
    second_emotion_id = db.Column(db.Integer, db.ForeignKey('second_emotions.id'))
    third_emotion_id = db.Column(db.Integer, db.ForeignKey('third_emotions.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    milestone_id = db.Column(db.Integer, db.ForeignKey('milestones.id'))
    date = db.Column(db.DateTime, nullable=False)
    score = db.Column(db.Integer, nullable=False)


    user = db.relationship("User", back_populates="user_sessions")
    base_emotion = db.relationship("BaseEmotion", back_populates="user_sessions")
    second_emotion = db.relationship("SecondEmotion", back_populates="user_sessions")
    third_emotion = db.relationship("ThirdEmotion", back_populates="user_sessions")
    post = db.relationship("Post", back_populates="user_session")
    milestone = db.relationship("Milestone", back_populates="user_session")

    def __repr__(self):
        return f"<UserSession id={self.id} date={self.date}>"



def connect_to_db(flask_app, db_uri="postgresql:///thoughts", echo=False):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the thoughts database')


if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)