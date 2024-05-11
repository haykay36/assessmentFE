import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import ReactSwitch from "react-switch";
import ErrorFallback from "./component/ErrorBoundary";
import Hero from "./component/hero";
import Github from "./pages/github";
import Profile from "./pages/profile";

export const ThemeContext = createContext("null");

function App() {
  const [theme, setTheme] = useState("dark");
  const [portfolio, setPortFolio] = useState([]);
  const [totalPages, setTotalPages] = useState(7);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [profileData, setProfileData] = useState([]);
  const [explode, setExplode] = useState(false);

  useEffect(() => {
    const repoPromise = axios.get(
      "https://api.github.com/users/haykay36/repos"
    );
    const profilePromise = axios.get("https://api.github.com/users/haykay36");
    Promise.all([repoPromise, profilePromise])
      .then(([repoResponse, profileResponse]) => {
        setPortFolio(repoResponse.data);
        setLoading(false);
        setProfileData(profileResponse.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <HelmetProvider>
      <title>Developer Portfolio</title>
      <meta name="description" content="Frontend Developer" />
      <link rel="canonical" href="/Portfolio" />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <section style={{ height: "100%" }}>
          <div className="switch">
            <label>{theme === "light" ? "Light Mode" : "Dark Mode"}</label>
            <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "100vh",
            }}
            className="Hero"
            id={theme}
          >
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => setExplode(false)}
              {...{ explode }}
            >
              {/* <Navbar/>
              <Hero/> */}
              <Scrollbars style={{ width: "100%", height: "100%" }}>
                <Hero />
                <Profile
                  alt="fetched data"
                  imgSrc={profileData.avatar_url}
                  name={profileData.name}
                  bio={profileData.bio}
                  location={profileData.location}
                  followers={profileData.followers}
                  following={profileData.following}
                  public_repos={profileData.public_repos}
                  html_url={profileData.html_url}
                  twitter_username={profileData.twitter_username}
                  medium_username={profileData.medium_username}
                />
                <Github />
              </Scrollbars>
              <div
                style={{
                  minHeight: "100%",
                  flexGrow: "1",
                  flexDirection: "column",
                }}
              ></div>
            </ErrorBoundary>
          </div>
        </section>
      </ThemeContext.Provider>
    </HelmetProvider>
  );
}

export default App;
