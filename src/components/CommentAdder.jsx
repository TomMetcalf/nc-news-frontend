import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { postComment } from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function CommentAdder({ setComments }) {
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(UserContext);
  const { article_id } = useParams();
  const [loginAlert, setLoginAlert] = useState(false);
  const [commentAlert, setCommentAlert] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [successfulPost, setSuccessfulPost] = useState(false);

  const history = useNavigate();

  const handleLoginLink = () => {
    history.push(`/users?article_id=${article_id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user.username === 'Logged Out') {
      setLoginAlert(true);
      return;
    }

    if (newComment.length === 0) {
      setCommentAlert(true);
      return;
    }

    setButtonDisabled(true);

    postComment(user.username, newComment, article_id)
      .then((newCommentFromApi) => {
        setNewComment('');
        setSuccessfulPost(true);
        setComments((currComments) => {
          return [...currComments, newCommentFromApi];
        });
        setButtonDisabled(false);
        setTimeout(() => {
          setSuccessfulPost(false);
        }, 2000);
      })
      .catch((err) => {
        alert(`Failed to post comment '${newComment}' Please try again.`);
        setButtonDisabled(false);
      });
  };

  const handleTextareaFocus = () => {
    setSuccessfulPost(false);
    setCommentAlert(false);
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <label className="add-comment-label" htmlFor="new-comment">
        Add a comment:
      </label>
      <textarea
        value={newComment}
        name="new-comment"
        id="new-comment"
        multiline="true"
        onChange={(e) => setNewComment(e.target.value)}
        onFocus={handleTextareaFocus}
      ></textarea>
      <div className="form-username">
        <label className="username-details" htmlFor="">
          Username:
        </label>
        <span className="username-details">{user.username}</span>
      </div>
      {loginAlert && (
        <div className="user-warning">
          <p className="comment-warning">
            Please log in as a user to post a comment.
            <Link
              className="comment-user-link"
              to={`/users?article_id=${article_id}`}
              onClick={handleLoginLink}
            >
              Click to select User
            </Link>
          </p>
        </div>
      )}
      {successfulPost && (
        <p className="successful-comment">
          Your comment was added successfully below!
        </p>
      )}
      {commentAlert && (
        <p className="comment-warning">Please add a comment before posting!</p>
      )}
      <button className="post-comment-btn" disabled={buttonDisabled}>
        Post comment
      </button>
    </form>
  );
}
