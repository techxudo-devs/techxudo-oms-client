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

  // Compute readable foreground (black/white) for a hex color
  const contrastText = (hex) => {
    try {
      const c = hex.replace("#", "");
      const r = parseInt(c.substring(0, 2), 16) / 255;
      const g = parseInt(c.substring(2, 4), 16) / 255;
      const b = parseInt(c.substring(4, 6), 16) / 255;
      const srgb = [r, g, b].map((v) =>
        v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      );
      const lum = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
      return lum > 0.5 ? "#000000" : "#ffffff";
    } catch {
      return "#ffffff";
    }
  };

  // Apply theme to CSS custom properties (Tailwind tokens)
  const applyThemeToDOM = (themeColors) => {
    const root = document.documentElement;

    // Back-compat custom variables (legacy)
    root.style.setProperty("--color-primary", themeColors.primaryColor);
    root.style.setProperty("--color-secondary", themeColors.secondaryColor);
    root.style.setProperty("--color-accent", themeColors.accentColor);

    // Tailwind CSS token variables used across UI
    root.style.setProperty("--primary", themeColors.primaryColor);
    root.style.setProperty(
      "--primary-foreground",
      contrastText(themeColors.primaryColor)
    );
    root.style.setProperty("--secondary", themeColors.secondaryColor);
    root.style.setProperty(
      "--secondary-foreground",
      contrastText(themeColors.secondaryColor)
    );
    root.style.setProperty("--accent", themeColors.accentColor);
    root.style.setProperty(
      "--accent-foreground",
      contrastText(themeColors.accentColor)
    );

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
