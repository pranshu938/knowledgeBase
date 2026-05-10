import api from "../../lib/api";

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};
