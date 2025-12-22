import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

export const useDonationRequests = (status, page = 1, limit = 10) => {
  return useQuery(["donationRequests", status, page], async () => {
    const { data } = await axiosInstance.get("/donation-requests", {
      params: { status, page, limit },
    });
    return data;
  });
};
