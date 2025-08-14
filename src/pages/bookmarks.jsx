import React, { useState, useEffect } from "react";
import styles from "./Bookmarks.module.css";
import { supabase } from "../lib/supabase.client";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const TYPES = [
  { value: "book", label: "📖 Book" },
  { value: "audio", label: "🎧 Audio" },
  { value: "course", label: "🎓 Course" },
  { value: "article", label: "📝 Article" },
  { value: "tool", label: "🛠 Tool" },
];

const CATEGORIES = [
  { value: "backend", label: "Backend / Systems", icon: "🖥" },
  { value: "frontend", label: "Frontend / UI", icon: "🖌" },
  { value: "devops", label: "DevOps / Cloud", icon: "☁️" },
  { value: "general", label: "General / Learning", icon: "📚" },
  { value: "misc", label: "Misc / Reference", icon: "📌" },
];

const PLACEHOLDER = "https://placehold.co/600x400";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [form, setForm] = useState({
    name: "",
    url: "",
    type: "book",
    category: "backend",
    imageUrl: "",
    description: "",
  });
  const [filters, setFilters] = useState({ type: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [opInProgress, setOpInProgress] = useState({}); // { [id]: true } for per-item ops

  useEffect(() => {
    fetchBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function fetchBookmarks() {
    setLoading(true);
    try {
      let query = supabase
        .from("bookmarks")
        .select("*")
        .order("id", { ascending: false });
      if (filters.type) query = query.eq("type", filters.type);
      if (filters.category) query = query.eq("category", filters.category);

      const { data, error } = await query;
      if (error) {
        console.error("fetchBookmarks error:", error);
        setBookmarks([]);
      } else {
        // normalize missing is_checked column
        setBookmarks(
          (data || []).map((d) => ({ ...d, is_checked: !!d.is_checked }))
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function addBookmark(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) {
      alert("Name and URL are required");
      return;
    }

    setOpInProgress((prev) => ({ ...prev, add: true }));
    try {
      const payload = {
        name: form.name.trim(),
        url: form.url.trim(),
        type: form.type,
        category: form.category,
        imageUrl: form.imageUrl || null,
        description: form.description || null,
      };

      const { error } = await supabase.from("bookmarks").insert([payload]);
      if (error) {
        console.error("addBookmark error:", error);
        alert("Failed to add bookmark (see console).");
      } else {
        setForm({
          name: "",
          url: "",
          type: "book",
          category: "backend",
          imageUrl: "",
          description: "",
        });
        fetchBookmarks();
      }
    } finally {
      setOpInProgress((prev) => {
        const copy = { ...prev };
        delete copy.add;
        return copy;
      });
    }
  }

  async function deleteBookmark(id) {
    if (!confirm("Delete this bookmark?")) return;
    setOpInProgress((prev) => ({ ...prev, [id]: true }));
    try {
      const { error } = await supabase.from("bookmarks").delete().eq("id", id);
      if (error) {
        console.error("deleteBookmark error:", error);
        alert("Failed to delete (see console).");
      }
      // refresh
      fetchBookmarks();
    } finally {
      setOpInProgress((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  }

  async function toggleChecked(b) {
    const newVal = !b.is_checked;
    // optimistic UI
    setBookmarks((prev) =>
      prev.map((x) => (x.id === b.id ? { ...x, is_checked: newVal } : x))
    );
    setOpInProgress((prev) => ({ ...prev, [b.id]: true }));

    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ is_checked: newVal })
        .eq("id", b.id);
      if (error) {
        console.error("toggleChecked error:", error);
        // revert if failed
        setBookmarks((prev) =>
          prev.map((x) => (x.id === b.id ? { ...x, is_checked: !newVal } : x))
        );
      }
    } finally {
      setOpInProgress((prev) => {
        const copy = { ...prev };
        delete copy[b.id];
        return copy;
      });
    }
  }

  const [user, setUser] = useState(null);

  useEffect(() => {
    // check if user is already logged in
    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ?? null));

    // listen for changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) console.error("Login error:", error.message);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out error:", error.message);
  };

  if (!user) {
    return (
      <div>
        <h1>Please login to access your bookmarks</h1>
        <button onClick={signInWithGitHub}>Sign in with GitHub</button>
      </div>
    );
  }

  return (
    <div className={styles.container} dir="ltr">
      <button type="submit" onClick={signOut}>
        sign out
      </button>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>📚 My Bookmarks</h1>
          <p className={styles.subtitle}>
            A personal collection of books, courses, articles and tools —
            curated and messy.
          </p>
        </div>

        <div className={styles.topBar}>
          <form className={styles.inlineForm} onSubmit={addBookmark}>
            <input
              className={styles.input}
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className={styles.input}
              type="url"
              placeholder="URL"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
            <input
              className={styles.input}
              type="url"
              placeholder="imageUrl(cover)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <select
              className={styles.smallSelect}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              className={styles.smallSelect}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={!!opInProgress.add}
              title="Add bookmark"
            >
              {opInProgress.add ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
        <hr />
        <div className={styles.filters}>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className={styles.select}
            aria-label="Filter by type"
          >
            <option value="">All Types</option>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className={styles.select}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => setFilters({ type: "", category: "" })}
          >
            Clear
          </button>
        </div>
      </header>

      <main>
        {loading ? (
          <div className={styles.empty}>Loading…</div>
        ) : bookmarks.length === 0 ? (
          <div className={styles.empty}>No bookmarks — try adding one.</div>
        ) : (
          <div className={styles.grid}>
            {bookmarks.map((b) => (
              <article
                key={b.id}
                className={`${styles.card} ${
                  b.is_checked ? styles.checked : ""
                }`}
              >
                <a
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.cardImageWrap}
                  aria-label={`Open ${b.name}`}
                >
                  <img
                    className={styles.cardImage}
                    src={b.imageUrl || PLACEHOLDER}
                    alt={b.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                  <div className={styles.overlay}>
                    <span className={styles.typeBadge}>
                      {TYPES.find((t) => t.value === b.type)?.label || b.type}
                    </span>
                  </div>
                </a>

                <div className={styles.cardBody}>
                  <div className={styles.cardHead}>
                    <h3 className={styles.cardTitle}>{b.name}</h3>
                  </div>
                  <span className={styles.categoryChip}>
                    {CATEGORIES.find((c) => c.value === b.category)?.icon}{" "}
                    {CATEGORIES.find((c) => c.value === b.category)?.label ||
                      b.category}
                  </span>

                  <p className={styles.cardDesc}>{b.description}</p>

                  <div className={styles.cardFooter}>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.linkBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open
                    </a>

                    <button
                      type="button"
                      className={`${styles.checkBtn} ${
                        b.is_checked ? styles.checkBtnActive : ""
                      }`}
                      onClick={() => toggleChecked(b)}
                      disabled={!!opInProgress[b.id]}
                      title={b.is_checked ? "Unmark" : "Mark as important"}
                      aria-pressed={b.is_checked}
                    >
                      {b.is_checked ? "Marked" : "Mark"}
                    </button>

                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => deleteBookmark(b.id)}
                      disabled={!!opInProgress[b.id]}
                      title="Delete"
                    >
                      {opInProgress[b.id] ? "Deleting..." : "Delete"}
                    </button>

                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() => navigator.clipboard?.writeText(b.url)}
                      title="Copy URL"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
