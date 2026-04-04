import axios from "axios";

export const BASE_URL = process.env.EXPO_PUBLIC_CLOUD_API_BASE_URL;

export const QuranInstance = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
});

export const config = {
  headers: {
    "Content-Type": " application/json ",
  },
};
