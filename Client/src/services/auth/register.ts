import api from "../../lib/api";
type regReqPayload = {
  name: string;
  email: string;
  password: string;
};

export const registerUser = async (payload: regReqPayload) => {
  try {
    const response = await api.post("/auth/register", payload);
    return response;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};
