import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // غير إذا كنت تستضيف الباكند في مكان آخر
});

export default instance;
