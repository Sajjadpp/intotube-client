import { View } from "lucide-react";
import ChannelProfile from "../pages/public/channelProfile/ChannelProfile";
import HomePage from "../pages/public/homePage/HomePage";
import SearchResult from "../pages/public/Search/SearchResult";
import VideoUploadPage from "../pages/public/uploadVideo/UploadVideo";
import ViewVideo from "../pages/public/viewVideo/ViewVideo";
import ShortsView from "../pages/public/viewShorts/ViewShorts";
import WatchHistory from "../pages/public/watchHistory/WatchHostory";
import Live1 from "../pages/public/channelLiveControl/Live1";
import Live2 from "../pages/public/channelLiveControl/Live2";

let routes = {
    
    public:[
        {path: '', element: HomePage},
        {path: 'video/:id', element: ViewVideo},
        {path: 'upload-video/:id', element: VideoUploadPage },
        {path: 'search', element: SearchResult},
        {path: 'channel/:id', element: ChannelProfile},
        {path: 'shorts/:id', element: ShortsView},
        {path: 'feed/history', element: WatchHistory},
        {path: 'live1', element: Live1},
        {path: 'live2/:streamerId', element: Live2}
    ]
}   

export default routes