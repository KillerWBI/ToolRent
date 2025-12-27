// lib/api/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "/", // всегда same-origin
  withCredentials: true,
});

