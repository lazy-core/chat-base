import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios'
import bcrypt from 'bcrypt'
import jwt, { Algorithm } from "jsonwebtoken";

interface DecodedToken {
  timestamp: number;
  [key: string]: any;
}

const request = async function request<T = any>(
  endpoint: string,
  params: Record<string, any> = {},
  requestType: string = "POST",
  isFullUrl: boolean = false,
  headers: AxiosRequestHeaders = {} as AxiosRequestHeaders
): Promise<T> {
  // const url: string = isFullUrl ? endpoint : `${process.env.HOST_IP}${endpoint}`;
  const url: string = isFullUrl ? endpoint : `http://server:5000/${endpoint}`;
  if (!isFullUrl && !headers.Authorization) {
    headers.Authorization = "Bearer " + process.env.JWT_SECRET;
  }

  try {
    let response: AxiosResponse<T>;
    const method = requestType.toUpperCase();

    if (method === "GET") {
      response = await axios.get(url, { headers, params });
    } else if (method === "POST") {
      response = await axios.post(url, params, { headers });
    } else if (method === "DELETE") {
      response = await axios.delete(url, { headers, data: params });
    } else {
      throw new Error(`Unsupported request type: ${requestType}`);
    }

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data ?? error.message ?? error;
    console.log("Error", errorMessage, url);
    return { err_message: errorMessage } as T;
  }
}

export default {
  request: request,
  isValidEmail: (email?: string): boolean => {
    return !!email?.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) || false
  },
  createHash: async (str: string): Promise<string> => {
    const saltRounds = 10
    const hash = await bcrypt.hashSync(str, saltRounds)
    return hash
  },
  createToken: <T extends object>(
    obj: T,
    secret?: string,
    algorithm: Algorithm = "HS256"
  ): string => {
    return jwt.sign({ timestamp: Date.now(), ...obj }, process.env.JWT_SECRET || '', { algorithm });
  },
  decodeToken: (
    token: string,
    threshold?: number
  ): (DecodedToken & { elapsedTime: number; isExpired: boolean }) | undefined => {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '') as DecodedToken;
      const elapsedTime = (Date.now() - decodedToken.timestamp) / 1000;

      return {
        ...decodedToken,
        elapsedTime,
        isExpired: threshold ? elapsedTime > threshold : false,
      };
    } catch (e: any) {
      return undefined;
    }
  }
}