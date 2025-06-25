import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

function GitHubProfile() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await fetch(
          "https://api.github.com/users/meiti-x"
        );
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch repositories
        const reposResponse = await fetch(
          "https://api.github.com/users/meiti-x/repos?sort=updated&per_page=18"
        );
        const reposData = await reposResponse.json();

        // Fetch language information for each repo
        const reposWithLanguages = await Promise.all(
          reposData.map(async (repo) => {
            const languagesResponse = await fetch(repo.languages_url);
            const languages = await languagesResponse.json();
            return {
              ...repo,
              languages: Object.keys(languages),
            };
          })
        );

        setRepos(reposWithLanguages);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!profile) {
    return <div className={styles.error}>Failed to load profile data</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <img
          src={profile.avatar_url}
          alt={profile.name}
          className={styles.avatar}
        />
        <h2 className={styles.name}>{profile.name}</h2>
        <p className={styles.bio}>{profile.bio}</p>

        <div className={styles.contactInfo}>
          {profile.company && (
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>🏢</span>
              <span>{profile.company}</span>
            </div>
          )}
          {profile.email && (
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📧</span>
              <a
                href={`mailto:${profile.email}`}
                className={styles.contactLink}
              >
                {profile.email}
              </a>
            </div>
          )}
          {profile.hireable && (
            <div className={styles.hireable}>
              <span className={styles.hireableIcon}>💼</span>
              <span>Available for hire</span>
            </div>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{profile.public_repos}</span>
            <span className={styles.statLabel}>Repositories</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{profile.followers}</span>
            <span className={styles.statLabel}>Followers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{profile.following}</span>
            <span className={styles.statLabel}>Following</span>
          </div>
        </div>
      </div>

      <div className={styles.reposSection}>
        <h3 className={styles.sectionTitle}>Featured Projects</h3>
        <div className={styles.reposGrid}>
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repoCard}
            >
              <h4 className={styles.repoName}>{repo.name}</h4>
              <p className={styles.repoDescription}>
                {repo.description || "No description available"}
              </p>

              {repo.languages && repo.languages.length > 0 && (
                <div className={styles.techStack}>
                  {repo.languages.map((language) => (
                    <span key={language} className={styles.techBadge}>
                      {language}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.repoStats}>
                <span className={styles.repoStat}>
                  <span className={styles.statIcon}>⭐</span>{" "}
                  {repo.stargazers_count}
                </span>
                <span className={styles.repoStat}>
                  <span className={styles.statIcon}>🔀</span> {repo.forks_count}
                </span>
                <span className={styles.repoStat}>
                  <span className={styles.statIcon}>👁️</span>{" "}
                  {repo.watchers_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GitHubProfile;
