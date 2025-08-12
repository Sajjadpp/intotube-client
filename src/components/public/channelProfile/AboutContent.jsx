export default AboutContent = () =>{

    return (
        <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">About This Channel</h2>
            <p className="text-gray-700 mb-6">
                Welcome to Code Tutorials! We're dedicated to helping developers of all skill levels master modern web development. 
                Our tutorials cover everything from the fundamentals of HTML, CSS, and JavaScript to advanced topics like React, 
                Next.js, and state management.
            </p>
            <p className="text-gray-700 mb-6">
                Our mission is to create high-quality, easy-to-follow content that helps you build real-world projects and advance 
                your career as a developer. We release new videos every week covering the latest technologies and best practices.
            </p>
            
            <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                <i className="fas fa-envelope text-purple-600 mr-3 text-xl"></i>
                <span>contact@codetutorials.com</span>
                </div>
                <div className="flex items-center">
                <i className="fab fa-twitter text-blue-400 mr-3 text-xl"></i>
                <span>@codetutorials</span>
                </div>
                <div className="flex items-center">
                <i className="fab fa-github text-gray-700 mr-3 text-xl"></i>
                <span>github.com/codetutorials</span>
                </div>
                <div className="flex items-center">
                <i className="fab fa-linkedin text-blue-600 mr-3 text-xl"></i>
                <span>linkedin.com/company/codetutorials</span>
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-4">Channel Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{stats.joined}</p>
                <p className="text-gray-600">Joined</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{stats.videos}</p>
                <p className="text-gray-600">Videos</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{stats.views}</p>
                <p className="text-gray-600">Total Views</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{stats.subscribers}</p>
                <p className="text-gray-600">Subscribers</p>
                </div>
            </div>
        </div>
    )
}