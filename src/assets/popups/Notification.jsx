import { IoClose } from "react-icons/io5";
import { BsCheck2Circle, BsExclamationCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useNotifications } from "../../context/notificationContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../../service/formatDate";
import axiosInstance from "../../axios/AxiosInstance";

const NotificationDropDown = ({ onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupNotification, setPopupNotification] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { notifications, newNotification, setNewNotification } = useNotifications();

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    useEffect(() => {
        if (!isClosing) return;
        setNewNotification(null);
    }, [isClosing, setNewNotification]);

    // Handle new notification popup
    useEffect(() => {
        if (newNotification) {
            setPopupNotification(newNotification);
            setShowPopup(true);
            
            // Auto-hide the popup after 5 seconds
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [newNotification, setShowPopup, setPopupNotification]);

    const handlePopupClick = () => {
        if (popupNotification?.relatedId) {
            navigate(`/video/${popupNotification.relatedId}`);
        }
        setShowPopup(false);
    };

    const handleNotClick = async(not) =>{
        console.log(not,' notification click')
        if(not.type === 'upload'){
            navigate(`/video/${not.relatedId}`);
        }
        else if(not.type === 'comment'){
           
            navigate(`/video/${not.relatedId}?commentId=${not.relatedId2}`)
        }
        else if(not.type === 'live'){
            navigate(`live2/${not.relatedId}`)
        }
    }

    return (
        <>
            {/* Popup Notification */}
            {showPopup && popupNotification && (
                <div 
                    className="fixed bottom-4 right-4 w-80 p-4 rounded-lg bg-white shadow-lg border border-gray-200 z-50 cursor-pointer transform transition-all duration-300 animate-fadeInUp"
                    onClick={handlePopupClick}
                    aria-label="New notification"
                    role="alert"
                >
                    <div className="flex gap-3">
                        <div className="mt-1">
                            {popupNotification.type === "upload" ? (
                                <BsCheck2Circle className="text-green-500" size={18} />
                            ) : (
                                <BsExclamationCircle className="text-yellow-500" size={18} />
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="font-medium text-gray-800 truncate">{popupNotification.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{popupNotification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">Just now</p>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPopup(false);
                            }}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close notification"
                        >
                            <IoClose size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Notification Dropdown */}
            <div 
                className={`absolute w-80 max-h-96 rounded-lg bg-white shadow-xl top-12 right-6 transform transition-all duration-300 ease-out overflow-hidden border border-gray-200 ${
                    isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
                }`}
                aria-label="Notifications dropdown"
                role="menu"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-blue-900 text-white">
                    <h2 className="font-bold text-lg">Notifications</h2>
                    <button 
                        onClick={handleClose}
                        className="p-1 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
                        aria-label="Close notifications"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto max-h-80">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleNotClick(notification)}
                                role="menuitem"
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        {notification.type === "upload" ? (
                                            <BsCheck2Circle className="text-green-500" size={18} />
                                        ) : (
                                            <BsExclamationCircle className="text-yellow-500" size={18} />
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="font-medium text-gray-800 truncate">{notification?.title}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{notification?.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification?.createdAt)}</p>
                                    </div>
                                </div>  
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No new notifications
                        </div>
                    )}
                    {/* Footer */}
                    <div className="p-2 text-center bg-gray-50 border-t border-gray-200 h-20">
                        <button 
                            className="text-sm text-blue-500 hover:underline"
                            aria-label="Mark all as read"
                        >
                            Mark all as read
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default NotificationDropDown;