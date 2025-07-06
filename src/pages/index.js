import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

const githubUsername = "meiti-x";
const profileImgUrl = `https://github.com/${githubUsername}.png`;
const email = "meiitiix@gmail.com";
const telegramChannel = "https://t.me/meitix";
const githubProfile = `https://github.com/${githubUsername}`;

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} - Portfolio`}
      description="Personal portfolio and documentation site"
    >
      <main
        style={{
          direction: "rtl",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem .2rem",
          flexDirection: "column",
        }}
      >
        <a
          href={githubProfile}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            transition: "transform 0.3s ease",
          }}
        >
          <img
            src={profileImgUrl}
            alt="GitHub profile"
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.borderRadius = "10%";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderRadius = "50%";
            }}
          />
        </a>
        <p style={{ fontSize: "1rem", color: "#666", marginBottom: ".1rem" }}>
          <span style={{ marginLeft: "0.5rem" }}>✉️</span>
          <a
            href={`mailto:${email}`}
            style={{ color: "#007acc", textDecoration: "none" }}
          >
            {email}
          </a>
        </p>
        <p style={{ fontSize: "1rem", color: "#007acc" }}>
          📢{" "}
          <a
            href={telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            کانال تلگرام من
          </a>
        </p>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          به دنیای یادداشت‌های من خوش آمدید 👋🏻
        </h1>
        <p
          style={{
            fontSize: "1rem",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: "2",
          }}
        >
          سلام، من مهدی‌ام و اینجا باغچه دیجیتال منه🌿 <br />
          جایی برای <strong>مستندسازی</strong> و <strong> سفری شخصی</strong> تو
          دنیای مهندسی نرم‌افزار و فراتر از اون. این پروژه فقط درباره‌ی کد و
          تکنولوژی نیست، بلکه درباره‌ی کاوش در کنجکاوی های خودمم هست؛ جایی که
          دانش فنی و تجربه‌های انسانی دست به دست هم می‌دن. اینجا چیزهایی که یاد
          می‌گیرم رو مستندسازی می‌کنم ✍🏼 و دوست دارم این سفر رو با تو هم به
          اشتراک بذارم🕊️
        </p>

        <Link className="button button--secondary button--lg" to="/docs/intro">
          شروع به خواندن
        </Link>
      </main>
    </Layout>
  );
}
