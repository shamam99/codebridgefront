import React, { useEffect, useState } from "react";
import "../styles/adminDashboard.css";
import adminService from "../services/adminService";
import ConfirmModal from "../components/ConfirmModal";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [news, setNews] = useState([]);
  const [searchPost, setSearchPost] = useState("");
  const [newNews, setNewNews] = useState({ title: "", content: "" });
  const [page, setPage] = useState(1);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});


  // USERS
  const loadUsers = async () => {
    const data = await adminService.fetchUsers();
    setUsers(data);
  };

  const handleDeleteUser = async (id) => {
    confirmDelete(async () => {
        await adminService.deleteUser(id);
        loadUsers();
    });
  };

  // POSTS
  const loadPosts = async () => {
    const data = await adminService.fetchPosts();
    setPosts(data);
  };

  const handleDeletePost = async (id) => {
    confirmDelete(async () => {
        await adminService.deletePost(id);
        loadPosts();
    });
  };

  // COMMENTS
  const loadComments = async () => {
    const data = await adminService.fetchComments();
    setComments(data);
    console.log("Loaded Comments:", data);

  };

  const handleDeleteComment = async (id) => {
    confirmDelete(async () => {
        await adminService.deleteComment(id);
        loadComments();
    });
  };

  // NEWS
  const loadNews = async () => {
    const data = await adminService.fetchNews(page);
    setNews(data);
  };

  const handleDeleteNews = async (id) => {
    confirmDelete(async () => {
        await adminService.deleteNews(id);
        loadNews();
    });
  };

  const handleCreateNews = async () => {
    if (!newNews.title || !newNews.content) return;
    await adminService.createNews(newNews.title, newNews.content);
    setNewNews({ title: "", content: "" });
    loadNews();
  };

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "posts") loadPosts();
    if (activeTab === "comments") loadComments();
    if (activeTab === "news") loadNews();
  }, [activeTab, page]);

  const confirmDelete = (action) => {
    setConfirmAction(() => action);
    setShowConfirm(true);
  };
  

  return (
    <div className="admin-dashboard">
        <aside className="admin-sidebar">
            <h2>Admin Panel</h2>
            <ul>
                <li onClick={() => setActiveTab("users")} className={activeTab === "users" ? "active" : ""}>
                <i className="fas fa-users"></i> Manage Users
                </li>
                <li onClick={() => setActiveTab("posts")} className={activeTab === "posts" ? "active" : ""}>
                <i className="fas fa-file-alt"></i> Manage Posts
                </li>
                <li onClick={() => setActiveTab("comments")} className={activeTab === "comments" ? "active" : ""}>
                <i className="fas fa-comments"></i> Manage Comments
                </li>
                <li onClick={() => setActiveTab("news")} className={activeTab === "news" ? "active" : ""}>
                <i className="fas fa-newspaper"></i> Manage News
                </li>
                <li onClick={() => setActiveTab("createAdmin")} className={activeTab === "createAdmin" ? "active" : ""}>
                <i className="fas fa-user-shield"></i> Create Admin
                </li>
            </ul>

            <button onClick={adminService.logoutAdmin} className="logout-button">
                <i className="fas fa-sign-out-alt"></i> Logout
            </button>
        </aside>


      <main className="admin-main">
        {/* USERS */}
        {activeTab === "users" && (
          <>
            <h2>Users</h2>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Username</th><th>Email</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id || u._id}>
                    <td>{u.name}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td><button className="delete-btn" onClick={() => handleDeleteUser(u._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* POSTS */}
        {activeTab === "posts" && (
          <>
            <h2>Posts</h2>
            <input className="admin-search" placeholder="Search by content..." value={searchPost} onChange={(e) => setSearchPost(e.target.value)} />
            <table className="admin-table">
              <thead>
                <tr><th>Author</th><th>Content</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {posts
                  .filter((p) => p.content.toLowerCase().includes(searchPost.toLowerCase()))
                  .map((post) => (
                    <tr key={post.id || post._id}>
                      <td>{post.userId?.name || "Unknown"}</td>
                      <td>{post.content}</td>
                      <td>{new Date(post.timestamp).toLocaleString()}</td>
                      <td><button className="delete-btn" onClick={() => handleDeletePost(post.id)}>Delete</button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}

        {/* COMMENTS */}
        {activeTab === "comments" && (
          <>
            <h2>Comments</h2>
            <table className="admin-table">
              <thead>
                <tr><th>User</th><th>Comment</th><th>Post</th><th>Time</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {comments.length > 0 ? (
                    comments.map((c, index) => (
                    <tr key={c.id || index}>
                        <td>{c.userId?.name || "Unknown"}</td>
                        <td>{c.content}</td>
                        <td>{c.postId?.content?.slice(0, 30) || "N/A"}</td>
                        <td>{new Date(c.timestamp).toLocaleString()}</td>
                        <td>
                        <button className="delete-btn" onClick={() => handleDeleteComment(c.id)}>
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr><td colSpan="5">No comments found.</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* NEWS */}
        {activeTab === "news" && (
          <>
            <h2>News</h2>
            <div style={{ marginBottom: "15px" }}>
              <input placeholder="Title" value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} />
              <input placeholder="Content" value={newNews.content} onChange={(e) => setNewNews({ ...newNews, content: e.target.value })} />
              <button onClick={handleCreateNews}>Create</button>
            </div>

            <table className="admin-table">
              <thead>
                <tr><th>Title</th><th>Content</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n._id || n.id}>
                    <td>{n.title}</td>
                    <td>{n.content}</td>
                    <td>{new Date(n.timestamp).toLocaleString()}</td>
                    <td><button className="delete-btn" onClick={() => handleDeleteNews(n.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
              <span style={{ margin: "0 10px" }}>Page {page}</span>
              <button onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </>
        )}

        {/* CREATE ADMIN */}
        {activeTab === "createAdmin" && (
            <div className="create-admin-container">
                <div className="create-admin-box">
                <h2 className="create-admin-title">Create New Admin</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                />
                <button
                    className="create-admin-btn"
                    onClick={async () => {
                    if (!newAdmin.name || !newAdmin.email || !newAdmin.password)
                        return alert("All fields are required.");
                    try {
                        await adminService.createAdmin(newAdmin.name, newAdmin.email, newAdmin.password);
                        alert("Admin created successfully.");
                        setNewAdmin({ name: "", email: "", password: "" });
                    } catch (error) {
                        alert(error.response?.data?.error || "Failed to create admin.");
                    }
                    }}
                >
                    Create Admin
                </button>
                </div>
            </div>
            )}

      </main>

      <ConfirmModal
        isOpen={showConfirm}
        message="Are you sure?"
        onConfirm={() => {
            setShowConfirm(false);
            confirmAction();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default AdminDashboard;
