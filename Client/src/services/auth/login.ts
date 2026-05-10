import api from "../../lib/api";
type regReqPayload = {
  email: string;
  password: string;
};

export const login = async (payload: regReqPayload) => {
  try {
    const response = await api.post("/auth/login", payload);
    return response;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};
