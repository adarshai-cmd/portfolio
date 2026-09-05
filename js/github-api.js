/* ==========================================================================
   GITHUB API FETCHER & STATS RENDERER
   Fetches user profile & repositories from GitHub for user 'adarshai-cmd'
   ========================================================================== */

(function () {
  const username = 'adarshai-cmd';

  // Fallback data in case API rate limits or network issues occur
  const fallbackData = {
    avatar_url: 'https://github.com/adarshai-cmd.png',
    public_repos: 12,
    followers: 18,
    following: 25,
    bio: 'MCA Student in AI & Data Science | Aspiring AI Researcher'
  };

  async function fetchGitHubProfile() {
    const avatarEl = document.getElementById('gh-avatar');
    const nameEl = document.getElementById('gh-name');
    const handleEl = document.getElementById('gh-handle');
    const reposCountEl = document.getElementById('gh-repos-count');
    const followersEl = document.getElementById('gh-followers-count');
    const followingEl = document.getElementById('gh-following-count');

    if (!avatarEl) return;

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();

      avatarEl.src = data.avatar_url || fallbackData.avatar_url;
      if (reposCountEl) reposCountEl.textContent = data.public_repos ?? fallbackData.public_repos;
      if (followersEl) followersEl.textContent = data.followers ?? fallbackData.followers;
      if (followingEl) followingEl.textContent = data.following ?? fallbackData.following;
    } catch (err) {
      console.warn('GitHub API fetch fallback used:', err);
      avatarEl.src = fallbackData.avatar_url;
      if (reposCountEl) reposCountEl.textContent = fallbackData.public_repos;
      if (followersEl) followersEl.textContent = fallbackData.followers;
      if (followingEl) followingEl.textContent = fallbackData.following;
    }
  }

  document.addEventListener('DOMContentLoaded', fetchGitHubProfile);
})();
