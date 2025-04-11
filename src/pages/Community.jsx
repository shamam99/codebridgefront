import React, { useEffect, useState } from "react";
import "../styles/community.css";
import profileImage from "../assets/profileImage.jpg";
import Navbar from "../components/Navbar";
import {
  createPost,
  deletePost,
  updatePost,
} from "../services/communityService";
import { fetchNews } from "../services/newsService";
import {
  fetchComments,
  createComment,
  deleteComment,
} from "../services/commentService";
import { searchCommunity } from "../services/communityService";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [showPostModal, setShowPostModal] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;
  const navigate = useNavigate();

  const loadCommunity = async () => {
    try {
      if (search.trim()) {
        const { users, posts } = await searchCommunity(search);
        setUsers(users);
        setPosts(posts);
      } else {
        const { posts } = await searchCommunity("");
        setUsers([]);
        setPosts(posts);
      }
    } catch (error) {
      console.error("Failed to load community data", error);
    }
  };

  const loadNews = async () => {
    try {
      const res = await fetchNews();
  
      if (Array.isArray(res.news)) {
        setNews(res.news);  
      } else {
        console.error("News response format unexpected:", res);
        setNews([]);
      }
    } catch (err) {
      console.error("Failed to fetch news", err);
      setNews([]);
    }
  };
  

  const loadComments = async (postId) => {
    try {
      const data = await fetchComments(postId);
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    loadCommunity();
    loadNews();
  }, [search]);

  const handleCreatePost = async () => {
    try {
      await createPost(newPost);
      setShowPostModal(false);
      setNewPost({ title: "", content: "" });
      setTimeout(() => {
        loadCommunity();
      }, 300);
    } catch {
      alert("Failed to create post");
    }
  };

  const handleDeletePost = async (id) => {
    if (confirm("Delete this post?")) {
      await deletePost(id);
      loadCommunity();
    }
  };

  const handleUpdatePost = async (id, content) => {
    await updatePost(id, { content });
    setEditingPostId(null);
    loadCommunity();
  };

  const handleAddComment = async (postId) => {
    if (!postId || !commentText[postId]) {
      console.error("Invalid postId or empty comment text");
      return;
    }
  
    const content = commentText[postId]?.trim();
    if (!content) return;
  
    try {
      await createComment(postId, content);
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      loadComments(postId);
    } catch (err) {
      console.error("Failed to create comment", err);
      alert("Failed to create comment");
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    await deleteComment(commentId);
    loadComments(postId);
  };

  return (
    <>
      <Navbar />
      <div className="community-container">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <h4>Search in Community</h4>
          <input
            type="text"
            className="project-search"
            placeholder="Search posts or users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {users.length > 0 && (
            <div className="search-users">
              <h5>Users</h5>
              <ul>
                {users.map((u) => (
                  <li
                    key={u._id}
                    className="search-user-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/profile/${u._id}`)}
                  >
                    <img
                      src={u.avatar || profileImage}
                      alt={u.name}
                      className="avatar"
                      style={{ width: "24px", height: "24px" }}
                    />
                    <span>{u.name} (@{u.username})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Main Feed */}
        <main className="main-feed">
          <div className="feed-header">
            <h3>Feeds</h3>
            <div className="feed-actions">
              <a href="#">Send feedback</a>
              <button className="filter-btn" onClick={() => setShowPostModal(true)}>
                + Post
              </button>
            </div>
          </div>

          {posts.map((post) => {
            if (!post.id) return null;
            return (
              <div key={post.id} className="feed-card repo">
                <div className="repo-header">
                  <img
                    src={post.userId?.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className="avatar"
                  />
                  <div>
                    <strong>{post.userId?.name}</strong>
                    <p className="time">{new Date(post.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                {editingPostId === post.id ? (
                  <>
                    <textarea
                      className="repo-desc"
                      value={post.content}
                      onChange={(e) => {
                        const updated = posts.map((p) =>
                          p.id === post.id ? { ...p, content: e.target.value } : p
                        );
                        setPosts(updated);
                      }}
                    />
                    <div className="repo-footer">
                      <button className="edit-btn" onClick={() => handleUpdatePost(post.id, post.content)}>Save</button>
                      <button className="delete-btn" onClick={() => setEditingPostId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="repo-desc">{post.content}</p>
                    <div className="repo-footer">
                      <span>💬 Comments</span>
                      {user?.id === post.userId?.id && (
                        <div>
                          <button className="edit-btn" onClick={() => setEditingPostId(post.id)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Comments */}
                <div className="comments">
                  <input
                    className="comment-input"
                    placeholder="Write a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                    onFocus={() => post.id && loadComments(post.id)}
                  />
                  <button className="star-btn" onClick={() => handleAddComment(post.id)}>Share</button>

                  {comments[post.id]?.map((c, i) => (
                    <div key={c._id || i} className="comment">
                      <img
                        src={c.userId?.avatar || "/default-avatar.png"}
                        alt="avatar"
                        className="avatar"
                        style={{ width: "32px", height: "32px" }}
                      />
                      <div>
                        <div>
                          <span className="comment-user">{c.userId?.name}</span>
                          <span className="comment-time"> – {new Date(c.timestamp).toLocaleString()}</span>
                        </div>
                        <div>{c.content}</div>
                      </div>
                      {c.userId?.id === user?.id && (
                        <div className="comment-actions">
                          <button onClick={() => handleDeleteComment(c._id, post.id)}>🗑</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </main>


        {/* Right Sidebar */}
        <aside className="sidebar right">
          <div className="box">
            <h4>Latest News</h4>
            <ul className="timeline">
              {news.map((item, index) => (
                <li key={item._id || index}>
                  <p className="date">{new Date(item.timestamp).toDateString()}</p>
                  <p>{item.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Share a new post</h3>
            <input
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleCreatePost}>Post</button>
              <button onClick={() => setShowPostModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Community;
