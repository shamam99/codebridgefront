import React, { useState, useEffect } from "react";
import "../styles/profile.css";
import Navbar from "../components/Navbar";
import profileImage from "../assets/profileImage.jpg";
import API from "../services/axiosInstance";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Modal from "react-modal";
import { deleteAvatar } from "../services/userService";

const Profile = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [uploadErrors, setUploadErrors] = useState({
    title: "",
    file: "",
  });
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [listType, setListType] = useState("followers"); 
  const [userList, setUserList] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editErrors, setEditErrors] = useState({ title: "", description: "" });
  const [starredProjects, setStarredProjects] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);



  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Upload project modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    visibility: "private",
    file: null,
  });

  const handleUploadChange = (e) => {
    const { name, value } = e.target;
    setUploadData({ ...uploadData, [name]: value });
  };

  const handleFileChange = (e) => {
    setUploadData({ ...uploadData, file: e.target.files[0] });
  };

  const uploadProject = async () => {
    const errors = {
      title: uploadData.title.trim() ? "" : "Title is required.",
      file: uploadData.file ? "" : "ZIP file is required.",
    };
  
    setUploadErrors(errors);
  
    // If there's any error, stop
    if (errors.title || errors.file) return;
  
    try {
      const formData = new FormData();
      formData.append("title", uploadData.title);
      formData.append("description", uploadData.description);
      formData.append("visibility", uploadData.visibility);
      formData.append("projectFile", uploadData.file);
  
      await API.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setShowUploadModal(false);
      setUploadData({ title: "", description: "", visibility: "private", file: null });
      setUploadErrors({ title: "", file: "" });
      fetchUserProjects();
    } catch (err) {
      alert("Upload failed.");
      console.error(err);
    }
  };  
  const handleEditProject = (project) => {
    setEditingProject({ ...project });
    setEditErrors({ title: "", description: "" });
    setShowEditModal(true);
  };

  const fetchUserProjects = async () => {
    try {
      const res = await API.get(`/projects/users/${id || currentUser.id}/projects`);
      setUserProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const res = await API.get("/users/profile/saved");
      setSavedPosts(res.data);
    } catch (err) {
      console.error("Failed to load saved posts", err);
    }
  };
  
  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const saveEditedProject = async () => {
    const errors = {
      title: editingProject.title.trim() ? "" : "Title is required.",
      description: editingProject.description.trim() ? "" : "Description is required.",
    };
    setEditErrors(errors);
    if (errors.title || errors.description) return;
  
    try {
      await API.put(`/projects/${editingProject._id}`, {
        title: editingProject.title,
        description: editingProject.description,
      });
      setShowEditModal(false);
      setEditingProject(null);
      fetchUserProjects(); 
    } catch (err) {
      console.error("Update project failed", err);
    }
  };
  
  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      API.delete(`/projects/${projectId}`)
        .then(() => fetchUserProjects())
        .catch((err) => console.error("Delete failed", err));
    }
  };

  const togglePinProject = async (projectId) => {
    try {
      await API.post(`/projects/${projectId}/pin`);
      fetchUserProjects(); 
    } catch (err) {
      console.error("Failed to pin/unpin project", err);
    }
  };

  const fetchStarredProjects = async () => {
    try {
      const res = await API.get(`/projects/users/${id || currentUser.id}/starred`);
      setStarredProjects(res.data);
    } catch (err) {
      console.error("Failed to load starred projects", err);
    }
  };
  

  const toggleStarProject = async (projectId) => {
    try {
      const isStarred = starredProjects.some(p => p._id === projectId);
      await API.post(`/projects/${projectId}/star`);
  
      setStarredProjects(prev =>
        isStarred
          ? prev.filter(p => p._id !== projectId)
          : [...prev, userProjects.find(p => p._id === projectId)]
      );
    } catch (err) {
      console.error("Failed to star/unstar project", err);
    }
  };

  

  const fetchProfile = async () => {
    try {
      const url = id ? `/users/${id}` : `/users/profile`;
      const response = await API.get(url);
      const data = response.data;
      setProfileData(data);
      if (!id || currentUser?.id === id) setIsMyProfile(true);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const toggleFollow = async () => {
    try {
      if (!profileData || !currentUser || isMyProfile) return;
      const endpoint = isFollowing
        ? `/users/${id}/unfollow`
        : `/users/${id}/follow`;
      await API.post(endpoint);
      setIsFollowing(!isFollowing);
      setProfileData((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((f) => f._id !== currentUser.id)
          : [...prev.followers, { _id: currentUser.id }],
      }));
    } catch (err) {
      console.error("Follow/unfollow error", err);
    }
  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("bio", profileData.bio || "");
      formData.append("company", profileData.company || "");
      formData.append("location", profileData.location || "");
      formData.append(
        "socialLinks",
        JSON.stringify([{ platform: "personal", url: profileData.socialLinks?.[0]?.url || "" }])
      );
      if (selectedImage) formData.append("avatar", selectedImage);

      const res = await API.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileData(res.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserProjects();
    fetchStarredProjects();
  }, [id]);
  

  useEffect(() => {
    if (profileData && currentUser) {
      const isUserFollowing = profileData.followers?.some(
        (f) => f._id === currentUser.id || f.id === currentUser.id
      );
      setIsFollowing(isUserFollowing);
    }
  }, [profileData, currentUser]);

  if (!profileData) return <p>Loading...</p>;

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const openUserListModal = async (type) => {
    setListType(type);
    try {
      const res = await API.get(`/users/${id || currentUser.id}/${type}`);
      setUserList(res.data);
      setShowUserListModal(true);
    } catch (err) {
      console.error(`Failed to load ${type}`, err);
    }
  };

  return (
    <>
      <Navbar avatar={profileData.avatar} />
      <div className="profile-page">
        <div className="tabs">
          {["overview", "projects", "stars", "saved"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={activeTab === tab ? "active-tab" : ""}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="profile-container">
          <div className="profile-left">
          <img
            src={profileData.avatar || profileImage}
            alt="User"
            className="profile-img"
          />

          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                style={{ marginTop: "10px", marginBottom: "5px" }}
              />
              
              {profileData.avatar && (
                <button
                  className="delete-avatar-btn"
                  onClick={async () => {
                    try {
                      await deleteAvatar();
                      setProfileData({ ...profileData, avatar: null });
                    } catch (err) {
                      console.error("Failed to delete avatar", err);
                    }
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "red",
                    cursor: "pointer"
                  }}
                >
                  🗑️ Remove Avatar
                </button>
              )}
            </>
          )}
            <h2>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                />
              ) : (
                profileData.name
              )}
            </h2>

            <p className="bio">
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                />
              ) : (
                profileData.bio
              )}
            </p>

            {isMyProfile ? (
              <button
                className={isEditing ? "save-btn" : "edit-btn"}
                onClick={isEditing ? saveProfile : () => setIsEditing(true)}
              >
                {isEditing ? "Save" : "Edit profile"}
              </button>
            ) : (
              <button className="follow-btn" onClick={toggleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}

            <div className="info">
            <p>
              👥{" "}
              <span
                onClick={() => openUserListModal("followers")}
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                {profileData.followers?.length || 0} followers
              </span>{" "}
              ·{" "}
              <span
                onClick={() => openUserListModal("following")}
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                {profileData.following?.length || 0} following
              </span>
            </p>

            <Modal
              isOpen={showUserListModal}
              onRequestClose={() => setShowUserListModal(false)}
              className="userlist-modal"
              overlayClassName="modal-backdrop"
            >
              <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                {listType === "followers" ? "Followers" : "Following"}
              </h3>
              <div className="userlist-scroll">
                {userList.length === 0 ? (
                  <p style={{ textAlign: "center" }}>No users found.</p>
                ) : (
                  userList.map((u) => {
                    const isCurrentUser = currentUser?.id === u._id;
                    const isFollowingUser = profileData.following?.some(
                      (f) => f._id === u._id
                    );
                    return (
                      <div className="userlist-item" key={u._id}>
                        <img src={u.avatar || profileImage} alt="avatar" />
                        <span>{u.name}</span>
                        {!isCurrentUser && isMyProfile && (
                          <button
                            onClick={async () => {
                              try {
                                const endpoint = isFollowingUser ? "unfollow" : "follow";
                                await API.post(`/users/${u._id}/${endpoint}`);

                                // Optional: update the local state after follow/unfollow
                                if (endpoint === "unfollow") {
                                  setProfileData((prev) => ({
                                    ...prev,
                                    following: prev.following.filter((f) => f._id !== u._id),
                                  }));
                                } else {
                                  setProfileData((prev) => ({
                                    ...prev,
                                    following: [...prev.following, { _id: u._id }],
                                  }));
                                }

                                fetchProfile(); 
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            {isFollowingUser ? "Unfollow" : "Follow"}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </Modal>
              <p>
                🏢{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="company"
                    value={profileData.company || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  profileData.company
                )}
              </p>

              <p>
                📍{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={profileData.location || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  profileData.location
                )}
              </p>

              <p>
                🔗{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="socialLinks"
                    value={profileData.socialLinks?.[0]?.url || ""}
                    onChange={(e) => {
                      const updatedLink = { platform: "personal", url: e.target.value };
                      setProfileData((prev) => ({
                        ...prev,
                        socialLinks: [updatedLink],
                      }));
                    }}
                  />
                ) : (
                  profileData.socialLinks?.[0]?.url
                )}
              </p>
            </div>

          </div>

          <div className="profile-right">
            {activeTab === "overview" && (
              <>
                <div className="projects-header">
                  <h3>Pinned</h3>
                </div>
                <div className="projects-grid">
                  {userProjects
                    .filter((p) => p.isPinned)
                    .map((proj) => (
                      <div key={proj._id} className="project-card">
                        <h4>
                          📌 <span className="project-name">{proj.title}</span>{" "}
                          <span className="tag">{proj.visibility}</span>
                        </h4>
                        <p>{proj.description}</p>
                        <a href={proj.fileUrl} download className="download-link">Download</a>
                      </div>
                    ))}
                </div>
              </>
            )}

            {activeTab === "projects" && (
              <>
                <div className="projects-header">
                  <h3>All Projects</h3>
                  {isMyProfile && (
                    <button className="upload-project-btn" onClick={() => setShowUploadModal(true)}>
                      + Upload Project
                    </button>
                  )}
                </div>
                <div className="projects-grid">
                  {userProjects.map((proj) => (
                    <div key={proj._id} className="project-card">
                      <h4>
                        📄 <span className="project-name">{proj.title}</span>{" "}
                        <span className="tag">{proj.visibility}</span>
                      </h4>
                      <p>{proj.description}</p>
                      <a href={proj.fileUrl} download className="download-link">Download</a>
                      
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", marginTop: isMyProfile ? "-100px" : "0px",}}>

                        {/* Show Edit / Delete / Pin only if it is your profile */}
                        <button
                          className="project-action-btn"
                          onClick={() => toggleStarProject(proj._id)}
                          title={starredProjects.some(p => p._id === proj._id) ? "Unstar Project" : "Star Project"}
                        >
                          {starredProjects.some(p => p._id === proj._id) ? "🌟" : "⭐"}
                        </button>
                        {isMyProfile && (
                          <>
                            <button className="project-action-btn" onClick={() => handleEditProject(proj)} title="Edit">✏️</button>
                            <button className="project-action-btn" onClick={() => handleDeleteProject(proj._id)} title="Delete">🗑️</button>
                            <button className="project-action-btn" onClick={() => togglePinProject(proj._id)} title={proj.isPinned ? "Unpin" : "Pin"}>
                              {proj.isPinned ? "📌" : "📍"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeTab === "stars" && (
              <>
                <div className="projects-header">
                  <h3>Starred Projects</h3>
                </div>
                <div className="projects-grid">
                  {starredProjects.length === 0 ? (
                    <p>You have no starred projects yet.</p>
                  ) : (
                    starredProjects.map((proj) => (
                      <div key={proj._id} className="project-card">
                        <h4>
                        🌟 <span className="project-name">{proj.title}</span>{" "}
                          <span className="tag">{proj.visibility}</span>
                        </h4>
                        <p>{proj.description}</p>
                        <a href={proj.fileUrl} download className="download-link">Download</a>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === "saved" && (
              <>
                <div className="projects-header">
                  <h3>Saved Posts</h3>
                </div>
                <div className="projects-grid">
                  {savedPosts.length === 0 ? (
                    <p>You have no saved posts.</p>
                  ) : (
                    savedPosts.map((post) => (
                      <div key={post._id} className="project-card">
                        <h4>
                          💾 <span className="project-name">{post.title}</span>
                        </h4>
                        <p>{post.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
            
            
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onRequestClose={() => setShowUploadModal(false)}
        className="modal-box"
        overlayClassName="modal-backdrop"
      >
        <h2>Upload Project</h2>
        <input
          name="title"
          placeholder="Title"
          value={uploadData.title}
          onChange={handleUploadChange}
          className={uploadErrors.title ? "error-input" : ""}
        />
        {uploadErrors.title && <p className="error">{uploadErrors.title}</p>}
        <textarea
          name="description"
          placeholder="Description"
          value={uploadData.description}
          onChange={handleUploadChange}
        />
        <select
          name="visibility"
          value={uploadData.visibility}
          onChange={handleUploadChange}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
        <input
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className={uploadErrors.file ? "error-input" : ""}
        />
        {uploadErrors.file && <p className="error">{uploadErrors.file}</p>}
        <div className="modal-actions">
          <button onClick={uploadProject}>Upload</button>
          <button onClick={() => setShowUploadModal(false)}>Cancel</button>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        className="modal-box"
        overlayClassName="modal-backdrop"
      >
        <h2>Edit Project</h2>
        <input
          name="title"
          value={editingProject?.title || ""}
          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
          className={editErrors.title ? "error-input" : ""}
        />
        {editErrors.title && <p className="error">{editErrors.title}</p>}

        <textarea
          name="description"
          value={editingProject?.description || ""}
          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
          className={editErrors.description ? "error-input" : ""}
        />
        {editErrors.description && <p className="error">{editErrors.description}</p>}

        <div className="modal-actions">
          <button onClick={saveEditedProject}>Save</button>
          <button onClick={() => setShowEditModal(false)}>Cancel</button>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
