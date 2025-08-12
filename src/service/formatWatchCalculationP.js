export function calculateWatchPercentage(duration, watchedDuration) {
  // Validate inputs
  if (typeof duration !== 'number' || 
      typeof watchedDuration !== 'number' ||
      duration <= 0) {
    return 0; // or handle error appropriately
  }

  // Ensure watched duration doesn't exceed total duration
  const adjustedWatched = Math.min(watchedDuration, duration);
  
  // Calculate percentage (round if needed)
  return (adjustedWatched / duration) * 100;
}