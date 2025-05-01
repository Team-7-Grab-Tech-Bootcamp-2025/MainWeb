import { Flex, Typography } from "antd";
import { Layout } from "antd";
import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import SearchBar from "./SearchBar";

const { Title } = Typography;
const { Header } = Layout;

const AppHeader: React.FC = () => {
  const [searchOpacity, setSearchOpacity] = useState(0);
  const [isHomePage, setIsHomePage] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    <Header className="bg-background sticky top-0 z-50 w-full border-b border-none px-3 shadow-sm transition-all duration-300 md:px-12">
      <Flex className="mx-auto h-full" align="center" gap={24}>
        <NavLink to="/">
          <Flex align="center" gap={12} className="min-w-max">
            <img
              src="/icon.svg"
              alt="Logo"
              className="text-foreground size-7"
            />
            <Title level={3} style={{ marginBottom: 0 }}>
              Angi
            </Title>
          </Flex>
        </NavLink>

        {/* Animated Search Bar in Header */}
        <Flex
          style={{
            opacity: isHomePage ? searchOpacity : 1,
            transform: isHomePage
              ? `translateY(${10 * (1 - searchOpacity)}px) scaleX(${searchOpacity})`
              : "none",
            transformOrigin: "center",
          }}
          className="w-full justify-center-safe transition-all duration-300 ease-in-out"
        >
          <Flex className="w-full max-w-lg">
            <SearchBar
              size="middle"
              className="rounded-lg shadow-sm md:-ml-14"
              addonWidth={120}
              // Replace onSearch with handleSearch, which is likely the correct prop name
              onSearch={(query: string) => {
                navigate(`/search?q=${encodeURIComponent(query)}`);
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Header>
  );
};

export default AppHeader;
