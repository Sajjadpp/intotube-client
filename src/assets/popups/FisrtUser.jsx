import { useState, useRef, useEffect } from "react";
import { FiX, FiCamera, FiCheck } from "react-icons/fi";
import axiosInstance from "../../axios/AxiosInstance";
import { useAuth } from "../../context/AuthContext";

const ProfilePopup = ({ onClose, onSave, initialData }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    _id: initialData._id,
    name: initialData?.name || "",
    username: initialData?.username || "",
    bio: initialData?.bio || "",
    avatar: initialData?.avatar,
    contentPreferences: {
      entertainment: initialData?.contentPreferences?.entertainment ?? true,
      education: initialData?.contentPreferences?.education ?? true,
      gaming: initialData?.contentPreferences?.gaming ?? false,
      music: initialData?.contentPreferences?.music ?? false,
      tech: initialData?.contentPreferences?.tech ?? false,
    },
  });


  useEffect(()=>{
    setFormData({
        _id: initialData._id,
        name: initialData?.name || "",
        username: initialData?.username || "",
        bio: initialData?.bio || "",
        avatar: initialData?.avatar,
        contentPreferences: {
        entertainment: initialData?.contentPreferences?.entertainment ?? true,
        education: initialData?.contentPreferences?.education ?? true,
        gaming: initialData?.contentPreferences?.gaming ?? false,
        music: initialData?.contentPreferences?.music ?? false,
        tech: initialData?.contentPreferences?.tech ?? false,
        },
    })
  }, [initialData])
  let {setUser} = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentPrefChange = (pref) => {
    setFormData((prev) => ({
      ...prev,
      contentPreferences: {
        ...prev.contentPreferences,
        [pref]: !prev.contentPreferences[pref],
      },
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            avatar: event.target.result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{

        const response = await axiosInstance.put('/auth/user', {
            _id: formData._id,
            name: formData.name,
            username: formData.username,
            bio: formData.bio,
            // coverImage: ... if you have this field
            videoReferance: Object.entries(formData.contentPreferences)
              .filter(([_, value]) => value)
              .map(([key]) => key) // Convert to array of strings
        });

        if(response.status === 200){

            setUser(response.data)
        }
        onClose
    }
    catch(error){
        console.log(error);
        return 
    }

    
  };

  if(initialData && initialData.contentPreferences || initialData.name && initialData.username) onClose()

  return (
    <>
      {/* Overlay (dark semi-transparent background) */}
      <div
        className="fixed inset-0 left-2 top-2 bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Popup (centered, above overlay) */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white  rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group mb-3">
                <img
                  className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                  src={formData.avatar}
                  alt="Profile"
                />
                <button
                  className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FiCamera className="text-white" size={20} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <button
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                onClick={() => fileInputRef.current.click()}
              >
                Change Profile Picture
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="text-black">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border text-black  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">youtube.com/@</span>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="username"
                    className="block w-full pl-32 pr-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell viewers about yourself"
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength="150"
                />
                <p className="mt-1 text-xs text-gray-500 text-right">
                  {formData.bio.length}/150
                </p>
              </div>

              {/* Content Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Preferences
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(formData.contentPreferences).map(
                    ([pref, checked]) => (
                      <div key={pref} className="flex items-center">
                        <input
                          id={pref}
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleContentPrefChange(pref)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                        />
                        <label
                          htmlFor={pref}
                          className="ml-2 block text-sm text-gray-700 capitalize"
                        >
                          {pref}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center"
            >
              <FiCheck className="mr-1" size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePopup;