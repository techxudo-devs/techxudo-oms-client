import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const token = useSelector((state) => state.auth.userInfo?.token);
  let user = null;

  if (token) {
    try {
      const decode = jwtDecode(token);
      user = {
        id: decode.id,
        fullName: decode.fullName,
        email: decode.email,
        role: decode.role,
        setupCompleted: decode.setupCompleted,
        organizationSlug: decode.organizationSlug,
      };
    } catch (error) {
      console.error("Invalid token", error);
      user = null;
    }
  }

  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";

  return {
    user,
    role: user?.role,
    isAdmin,
    isEmployee,
    setupCompleted: user?.setupCompleted,
  };
};
