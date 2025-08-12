import { useState, useRef, useEffect } from "react";
import { FiUpload, FiX, FiClock, FiCheck, FiHash, FiImage, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../axios/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VideoUploadPage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState({
    title: "",
    description: "",
    category: "education",
    hashtags: [],
    visibility: "public",
    videoType: "normal"
  });
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [hashtagInput, setHashtagInput] = useState("");
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [defaultThumbnailFile, setDefaultThumbnailFile] = useState(null);
  const [previewThumbnailUrl, setPreviewThumbnailUrl] = useState("");

  const steps = [
    "Upload Video",
    "Video Details",
    "Visibility Settings"
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      setError("Please select a video file (MP4, MOV, etc.)");
      return;
    }

    if (selectedFile.size > 500 * 1024 * 1024) {
      setError("File size exceeds the 500MB limit");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    const video = document.createElement("video");
    video.preload = "metadata";
    
    video.onloadedmetadata = () => {
      setDuration(Math.round(video.duration));
      video.currentTime = Math.min(1, video.duration);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const thumbnailFile = new File([blob], "thumbnail.jpg", {
          type: "image/jpeg",
        });
        setDefaultThumbnailFile(thumbnailFile);
        setPreviewThumbnailUrl(URL.createObjectURL(thumbnailFile));
      }, "image/jpeg", 0.8);
    };

    video.src = URL.createObjectURL(selectedFile);
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG)");
      return;
    }

    setThumbnailFile(selectedFile);
    setPreviewThumbnailUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!videoInfo.title.trim()) {
      setError("Title is required");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("thumbnail", thumbnailFile || defaultThumbnailFile);
    formData.append("title", videoInfo.title);
    formData.append("description", videoInfo.description);
    formData.append("category", videoInfo.category);
    formData.append("hashtags", JSON.stringify(videoInfo.hashtags));
    formData.append("visibility", videoInfo.visibility);
    formData.append("videoType", videoInfo.videoType);

    try {
      const response = await axiosInstance.post("/video/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      resetForm();
      toast.success('Video uploaded successfully');
      navigate('/');
    } catch (error) {
      console.error("Upload failed:", error);
      if(error.response.status === 403){
        toast.info('signup')
        navigate('/')
      }
      setError(error.response?.data?.message || "Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl("");
    setUploadProgress(0);
    setVideoInfo({
      title: "",
      description: "",
      category: "education",
      hashtags: [],
      visibility: "public",
      videoType: "video"
    });
    setHashtagInput("");
    setThumbnailFile(null);
    setDefaultThumbnailFile(null);
    setPreviewThumbnailUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setCurrentStep(1);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/\s+/g, '');
    if (!tag || tag === '#') return;

    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    
    if (!videoInfo.hashtags.includes(formattedTag)) {
      setVideoInfo({
        ...videoInfo,
        hashtags: [...videoInfo.hashtags, formattedTag]
      });
    }
    
    setHashtagInput("");
  };

  const removeHashtag = (tagToRemove) => {
    setVideoInfo({
      ...videoInfo,
      hashtags: videoInfo.hashtags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleHashtagKeyDown = (e) => {
    if (['Enter', ' ', ','].includes(e.key)) {
      e.preventDefault();
      addHashtag();
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !file) {
      setError("Please select a video file");
      return;
    }
    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (previewThumbnailUrl) URL.revokeObjectURL(previewThumbnailUrl);
    };
  }, [previewUrl, previewThumbnailUrl]);

  return (
    <div className="min-h-screen bg-white flex w-full items-center justify-center py-8 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2">
          <div 
            className="bg-blue-900 h-2 transition-all duration-300" 
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-black">{steps[currentStep - 1]}</h1>
          <button
            onClick={() => window.history.back()}
            className="text-black hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Upload Video */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="mb-6">
                {!file ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="flex justify-center mb-4">
                      <FiUpload className="text-gray-500 text-4xl" />
                    </div>
                    <p className="text-gray-700">Drag and drop video files or click to browse</p>
                    <p className="text-sm text-gray-500 mt-2">
                      MP4, MOV or AVI. Max 500MB.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="video/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      src={previewUrl}
                      controls
                      className="w-full max-w-100 mx-h-50 rounded-lg bg-black"
                    />
                    <button
                      onClick={resetForm}
                      className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition"
                      aria-label="Remove video"
                    >
                      <FiX />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
                      <FiClock className="mr-1" />
                      {formatDuration(duration)}
                    </div>
                  </div>
                )}
              </div>

              {file && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail
                  </label>
                  <div className="flex items-center gap-4">
                    {previewThumbnailUrl && (
                      <div className="relative">
                        <img
                          src={previewThumbnailUrl}
                          alt="Thumbnail preview"
                          className="w-32 h-18 object-cover rounded-lg"
                        />
                        {(thumbnailFile || defaultThumbnailFile) && (
                          <button
                            onClick={() => {
                              setThumbnailFile(null);
                              setPreviewThumbnailUrl(
                                URL.createObjectURL(defaultThumbnailFile)
                              );
                            }}
                            className="absolute top-0 right-0 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-100 transition"
                          >
                            <FiX size={16} />
                          </button>
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer transition"
                      >
                        <FiImage className="inline mr-2" />
                        {thumbnailFile ? "Change Thumbnail" : "Upload Thumbnail"}
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        Recommended size: 1280x720 (16:9)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!file}
                  className={`px-6 py-2 rounded-md font-medium text-white ${
                    !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
                  } transition flex items-center`}
                >
                  Next <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Video Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={videoInfo.title}
                    onChange={(e) =>
                      setVideoInfo({ ...videoInfo, title: e.target.value })
                    }
                    placeholder="Add a title that describes your video"
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={videoInfo.description}
                    onChange={(e) =>
                      setVideoInfo({ ...videoInfo, description: e.target.value })
                    }
                    placeholder="Tell viewers about your video"
                    rows="3"
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={videoInfo.category}
                    onChange={(e) =>
                      setVideoInfo({ ...videoInfo, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  >
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="gaming">Gaming</option>
                    <option value="music">Music</option>
                    <option value="tech">Technology</option>
                    <option value="news">News</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 mb-1">
                    Hashtags
                  </label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiHash className="text-gray-400" />
                      </div>
                      <input
                        id="hashtags"
                        type="text"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={handleHashtagKeyDown}
                        placeholder="Add hashtags (press Enter or Space)"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addHashtag}
                      className="ml-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 rounded-md text-white transition"
                    >
                      Add
                    </button>
                  </div>
                  {videoInfo.hashtags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {videoInfo.hashtags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-900"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeHashtag(tag)}
                            className="ml-2 text-blue-900 hover:text-blue-700"
                            aria-label={`Remove ${tag}`}
                          >
                            <FiX size={16} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 rounded-md font-medium text-blue-900 hover:text-blue-700 transition flex items-center"
                >
                  <FiArrowLeft className="mr-2" /> Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!videoInfo.title}
                  className={`px-6 py-2 rounded-md font-medium text-white ${
                    !videoInfo.title ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
                  } transition flex items-center`}
                >
                  Next <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Visibility Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Visibility</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={videoInfo.visibility === "public"}
                        onChange={() => setVideoInfo({...videoInfo, visibility: "public"})}
                        className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300"
                      />
                      <span className="text-gray-700">
                        <span className="font-medium">Public</span> - Anyone can view this video
                      </span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="visibility"
                        value="unlisted"
                        checked={videoInfo.visibility === "unlisted"}
                        onChange={() => setVideoInfo({...videoInfo, visibility: "unlisted"})}
                        className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300"
                      />
                      <span className="text-gray-700">
                        <span className="font-medium">Unlisted</span> - Only people with the link can view this video
                      </span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={videoInfo.visibility === "private"}
                        onChange={() => setVideoInfo({...videoInfo, visibility: "private"})}
                        className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300"
                      />
                      <span className="text-gray-700">
                        <span className="font-medium">Private</span> - Only you can view this video
                      </span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Video Type</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="videoType"
                        value="normal"
                        checked={videoInfo.videoType === "normal"}
                        onChange={() => setVideoInfo({...videoInfo, videoType: "normal"})}
                        className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300"
                      />
                      <span className="text-gray-700">
                        <span className="font-medium">Regular Video</span> - Standard video format
                      </span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="videoType"
                        value="shorts"
                        checked={videoInfo.videoType === "shorts"}
                        onChange={() => setVideoInfo({...videoInfo, videoType: "shorts"})}
                        className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300"
                      />
                      <span className="text-gray-700">
                        <span className="font-medium">Shorts</span> - Short-form vertical video
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-6">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-900 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 rounded-md font-medium text-blue-900 hover:text-blue-700 transition flex items-center"
                >
                  <FiArrowLeft className="mr-2" /> Back
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || !videoInfo.title || isUploading}
                  className={`px-6 py-2 rounded-md font-medium text-white ${
                    !file || !videoInfo.title || isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-900 hover:bg-blue-800"
                  } transition flex items-center`}
                >
                  {isUploading ? (
                    <>
                      <span className="animate-pulse mr-2">⋯</span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" />
                      Upload Video
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUploadPage;