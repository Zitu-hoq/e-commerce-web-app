import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export const Get = async (dir: string) => {
  const url = baseUrl + dir;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const API = axios.create({
  baseURL: baseUrl, // Adjust based on your backend URL
  withCredentials: true, // Required for HTTP-only cookies
});

// export const postProduct = async (data: z.infer<typeof formSchema>) => {
//   const url = baseUrl + "/api/admin/product/add";
//   try {
//     const response = await axios.post(url, data);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };
