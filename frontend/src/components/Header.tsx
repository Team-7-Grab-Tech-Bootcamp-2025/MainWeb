import { Flex } from "antd";
import { Layout } from "antd";
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import SearchBar from "./SearchBar";
import "./Header.css";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const [searchOpacity, setSearchOpacity] = useState(0);
  const [isHomePage, setIsHomePage] = useState(false);
  const location = useLocation();
  // Check if current page is home page
  useEffect(() => {
    // Assuming '/' is the home page path
    const onHomePage = location.pathname === "/";
    setIsHomePage(onHomePage);

    // Reset search opacity when changing pages
    setSearchOpacity(onHomePage ? 0 : 1);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      // Only apply scroll-based visibility on home page
      if (!isHomePage) return;

      const heroSearchBar = document.getElementById("hero-search");
      if (heroSearchBar) {
        const rect = heroSearchBar.getBoundingClientRect();
        const headerHeight = 64; // Adjust this if your header height differs

        // Calculate how much of the hero search bar is hidden
        const hiddenHeight = Math.min(
          rect.height,
          Math.max(0, headerHeight - rect.top),
        );
        const hiddenPercentage =
          rect.height > 0 ? hiddenHeight / rect.height : 0;
        setSearchOpacity(hiddenPercentage);
      } else {
        // If hero search not found, ensure search bar is visible
        setSearchOpacity(1);
      }
    };

    // Set initial state on mount and when isHomePage changes
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <Header className="header">
      <Flex className="header-container" align="center" gap={24}>
        <Flex align="center">
          <NavLink to="/" className="logo-nav-link">
            <img src="/icon.png" alt="Logo" className="logo" />
          </NavLink>
        </Flex>

        {/* Simple Navigation Links */}
        <Flex gap={24} className="nav-links" align="center">
          <NavLink to="/" className="nav-link">
            Trang chủ
          </NavLink>
          <NavLink to="/restaurants" className="nav-link">
            Nhà hàng
          </NavLink>
          <NavLink to="/cuisines" className="nav-link">
            Ẩm thực
          </NavLink>
          <NavLink to="/ask" className="nav-link">
            Chatbot
          </NavLink>
        </Flex>

        {/* Animated Search Bar in Header */}
        <Flex
          style={{
            opacity: isHomePage ? searchOpacity : 1,
            transform: isHomePage
              ? `translateY(${10 * (1 - searchOpacity)}px) scaleX(${searchOpacity})`
              : "none",
            transformOrigin: "center",
          }}
          className="search-container"
        >
          <SearchBar size="middle" className="search-bar" />
        </Flex>
      </Flex>
    </Header>
  );
};

export default AppHeader;
