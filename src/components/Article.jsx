import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleById, patchArticleVote } from '../api';
import BeatLoader from 'react-spinners/BeatLoader';
import Comment from './Comment';

export default function singleArticle() {
  const [currentArticle, setCurrentArticle] = useState({});
  const [isLoading, setIsLoading] = useState();
  const { article_id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetchArticleById(article_id).then(({ article }) => {
      setCurrentArticle(article);
      setIsLoading(false);
    });
  }, [article_id]);

  const checkUserOnline = () => {
    if (!navigator.onLine) {
      alert(
        "You are currently offline, so any votes made won't be counted. Please reconnect to the internet and then resubmit your vote."
      );
    }
  };

  const upVote = (article_id) => {
    checkUserOnline();

    const updatedArticle = {
      ...currentArticle,
      votes: currentArticle.votes + 1,
    };

    setCurrentArticle(updatedArticle);
    patchArticleVote(article_id, +1).catch((err) => {
      alert('Failed to update + vote. Please try again.');
    });

    return updatedArticle;
  };

  const downVote = (article_id) => {
    checkUserOnline();

    const updatedArticle = {
      ...currentArticle,
      votes: currentArticle.votes - 1,
    };

    setCurrentArticle(updatedArticle);
    patchArticleVote(article_id, -1).catch((err) => {
      alert('Failed to update - vote. Please try again.');
    });

    return updatedArticle;
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

  const { title, article_img_url, body, topic, author, votes } = currentArticle;

  const dateString = currentArticle.created_at;
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
    <main className="article-container">
      <h2>{title}</h2>
      <div className="article-img-body">
        <p className="article-body">{body}</p>
        <img className="article-img" src={article_img_url} alt={title} />
      </div>
      <div className="article-headings">
        <p className="article-detail">Category: {topic}</p>
        <p className="article-detail">Author: {author}</p>
        <p className="article-detail">Published: {formattedDate}</p>
      </div>
      <div>
        <p>Votes: {votes}</p>
        <button className="vote-button" onClick={() => downVote(article_id)}>
          - Vote
        </button>
        <button className="vote-button" onClick={() => upVote(article_id)}>
          + Vote
        </button>
      </div>
      <Comment articleId={article_id} />
      <Link to={'/'}>
        <p className="main-article-list">
          Click to return to main article list
        </p>
      </Link>
    </main>
  );
}
