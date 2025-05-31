import { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const MoodInput = () => {
  const [moodText, setMoodText] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!moodText.trim()) return;
    
    // Clear previous results when submitting new mood
    setPlaylist([]);
    setIsLoading(true);
    
    try {
      const { data } = await axios.post(
        'https://ai-mood-based-music-generator-1.onrender.com/api/playlist',
        { text: moodText }
      );
      setPlaylist(data.tracks);
    } catch (err) {
      console.error(err);
      alert('Failed to generate playlist');
    }
    setIsLoading(false);
  };

  // Clear all songs
  const handleClearPlaylist = () => {
    setPlaylist([]);
    setMoodText('');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">MooodiFy</h1>
        <p className="text-gray-600">Generate playlists based on your mood</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mood-input" className="block text-sm font-medium text-gray-700 mb-1">
              Describe your mood
            </label>
            <input
              id="mood-input"
              type="text"
              value={moodText}
              onChange={(e) => {
                // Clear playlist when user starts typing new mood
                if (playlist.length > 0) setPlaylist([]);
                setMoodText(e.target.value);
              }}
              placeholder="e.g. nostalgic malayalam melodies, happy workout songs..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Songs'
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {isLoading && !playlist.length && (
        <div className="text-center py-8">
          <p className="text-gray-500">Finding the perfect tracks for your mood...</p>
        </div>
      )}

      {playlist.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {'Songs Recommended based on your Mood'}
            </h2>
            <button
              onClick={handleClearPlaylist}
              className="text-sm text-red-600 hover:text-red-800 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {playlist.map((track, index) => (
              <li key={index} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {track.album_image ? (
                      <img 
                        className="h-16 w-16 rounded-md object-cover" 
                        src={track.album_image} 
                        alt={`${track.track_name} album cover`}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {track.track_name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {track.artist}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {track.preview_url ? (
                      <audio controls className="h-8">
                        <source src={track.preview_url} type="audio/mpeg" />
                      </audio>
                    ) : (
                      <span className="text-xs text-gray-400">No preview</span>
                    )}
                    <a
                      href={track.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      Play
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MoodInput;