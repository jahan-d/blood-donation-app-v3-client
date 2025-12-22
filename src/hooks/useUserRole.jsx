// src/hooks/useUserRole.js
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../contexts/AuthContext/AuthProvider";

const useUserRole = () => {
  const { user, axiosSecure } = useContext(AuthContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/users/profile");
      return res.data;
    },
  });

  return [
    data?.role || user?.role || "donor",
    data?.status || user?.status || "active",
    isLoading,
    isError,
  ];
};

export default useUserRole;
