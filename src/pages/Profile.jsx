import React, { useState, useEffect } from "react";
import "../styles/profile.css";
import Navbar from "../components/Navbar";
import profileImage from "../assets/profileImage.jpg";
import API from "../services/axiosInstance";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Modal from "react-modal";

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
    if (!uploadData.file || !uploadData.title) {
      alert("Title and file are required.");
      return;
    }

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
      fetchUserProjects();
    } catch (err) {
      alert("Upload failed.");
      console.error(err);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const res = await API.get(`/projects/users/${id || currentUser.id}/projects`);
      setUserProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects", err);
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

  return (
    <>
      <Navbar avatar={profileData.avatar} />
      <div className="profile-page">
        <div className="tabs">
          <button className="active-tab">Overview</button>
          <button>Projects</button>
          <button>Stars</button>
          <button>Saved</button>
        </div>

        <div className="profile-container">
          <div className="profile-left">
            <img
              src={profileData.avatar || profileImage}
              alt="User"
              className="profile-img"
            />

            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
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
                👥 {profileData.followers?.length || 0} followers ·{" "}
                {profileData.following?.length || 0} following
              </p>

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
            <div className="projects-header">
              <h3>Pinned</h3>
              {isMyProfile && (
                <button className="upload-project-btn" onClick={() => setShowUploadModal(true)}>
                  + Upload Project
                </button>
              )}
            </div>
            <div className="projects-grid">
            {userProjects
              .filter((p) => isMyProfile || p.visibility === "public")
              .map((proj) => (
                <div key={proj._id} className="project-card">
                  <h4>
                    📄 <span className="project-name">{proj.title}</span>{" "}
                    <span className="tag">{proj.visibility}</span>
                  </h4>
                  <p>{proj.description}</p>
                  <a href={proj.fileUrl} download className="download-link">Download</a>
                </div>
              ))}
            </div>
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
        />
        <textarea
          name="description"
          placeholder="Description"
          value={uploadData.description}
          onChange={handleUploadChange}
        />
        <select name="visibility" value={uploadData.visibility} onChange={handleUploadChange}>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
        <input type="file" accept=".zip" onChange={handleFileChange} />
        <div className="modal-actions">
          <button onClick={uploadProject}>Upload</button>
          <button onClick={() => setShowUploadModal(false)}>Cancel</button>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
