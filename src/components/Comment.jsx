import { useState, useEffect } from 'react';
import { deleteComment, fetchCommentsByArticleId } from '../api';
import BeatLoader from 'react-spinners/BeatLoader';
import CommentAdder from './CommentAdder';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function Comment({ articleId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const { user } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    fetchCommentsByArticleId(articleId)
      .then((res) => {
        setComments(res.comment);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [articleId]);

  const handleDeleteComment = (deleteId) => {
    deleteComment(deleteId)
      .then((status) => {
        if (status === 204) {
          alert('Comment successfully deleted.');
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.comment_id !== deleteId)
          );
        }
      })
      .catch((err) => {
        alert('There was an problem deleting your message. Please try again');
      });
  };

  if (isLoading) {
    return (
      <BeatLoader
        color={'#ffffff'}
        loading={isLoading}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
        margin={20}
      />
    );
  }

  const reversedComments = [...comments].reverse();

  return (
    <section className="comments-container">
      <section>
        <CommentAdder articleId={articleId} setComments={setComments} />
      </section>
      <section>
        {reversedComments.length === 0 ? (
          <p>No comments available.</p>
        ) : (
          <ul>
            {reversedComments.map((comment) => {
              const { comment_id, body, author, votes } = comment;

              const dateString = comment.created_at;
              const dateObj = new Date(dateString);
              const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZone: 'UTC',
              };
              const formattedDate = dateObj.toLocaleString('en-UK', options);

              return (
                <li key={comment_id}>
                  <section className="comments-section">
                    <div className="delete-btn-container">
                      {user.username === author ? (
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteComment(comment_id)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                    <p>{body}</p>
                    <div className="comments-flex">
                      <p className="comment-detail">Posted by: {author}</p>
                      <p className="comment-detail">
                        Date posted: {formattedDate}
                      </p>
                      <p className="comment-detail">Votes: {votes}</p>
                    </div>
                  </section>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
}
