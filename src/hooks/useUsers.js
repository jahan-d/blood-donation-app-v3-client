// src/hooks/useUsers.js
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../contexts/AuthContext/AuthProvider";

const useUsers = (status) => {
  const { axiosSecure } = useContext(AuthContext);

  return useQuery(["users", status], async () => {
    const { data } = await axiosSecure.get("/users", { params: { status } });
    return data;
  });
};

export default useUsers;
