import { createContext, useContext, useEffect, useState } from "react";
import { useGetCurrentOrganizationQuery } from "@/shared/store/features/organizationApiSlice";
import { useAuth } from "@/shared/hooks/useAuth";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState({
    primaryColor: "#000000",
    secondaryColor: "#6B7280",
    accentColor: "#3B82F6",
    darkMode: false,
  });
  const [logo, setLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");

  // Fetch organization data
  const { data: organizationData } = useGetCurrentOrganizationQuery(undefined, {
    skip: !user || !user.organizationId, // Only fetch if user is logged in and has an organization
    refetchOnMountOrArgChange: true,
  });

  // Update theme when organization data changes
  useEffect(() => {
    if (organizationData?.data) {
      const org = organizationData.data;

      // Update theme from organization
      if (org.theme) {
        setTheme({
          primaryColor: org.theme.primaryColor || "#000000",
          secondaryColor: org.theme.secondaryColor || "#6B7280",
          accentColor: org.theme.accentColor || "#3B82F6",
          darkMode: org.theme.darkMode || false,
        });
      }

      // Update logo and company name
      setLogo(org.logo || null);
      setCompanyName(org.companyName || "");

      // Apply theme to CSS variables
      applyThemeToDOM({
        primaryColor: org.theme?.primaryColor || "#000000",
        secondaryColor: org.theme?.secondaryColor || "#6B7280",
        accentColor: org.theme?.accentColor || "#3B82F6",
        darkMode: org.theme?.darkMode || false,
      });
    }
  }, [organizationData]);

  // Apply theme to CSS custom properties
  const applyThemeToDOM = (themeColors) => {
    const root = document.documentElement;

    // Primary color (for buttons, links, important elements)
    root.style.setProperty("--color-primary", themeColors.primaryColor);

    // Secondary color (for subtle elements)
    root.style.setProperty("--color-secondary", themeColors.secondaryColor);

    // Accent color (for highlights, notifications)
    root.style.setProperty("--color-accent", themeColors.accentColor);

    // Dark mode toggle
    if (themeColors.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Update theme dynamically (for live preview in setup wizard)
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
  };

  // Update logo dynamically
  const updateLogo = (newLogo) => {
    setLogo(newLogo);
  };

  const value = {
    theme,
    logo,
    companyName,
    updateTheme,
    updateLogo,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
