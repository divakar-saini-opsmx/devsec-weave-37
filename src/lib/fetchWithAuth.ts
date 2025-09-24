
import { toast } from "sonner";


export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {

    const res = await fetch(input, {
      ...init,
      credentials: 'include', // always send cookies
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  
    if (res.status === 401) {
      // 🔒 Handle 401 globally
      //console.warn("Unauthorized - Redirecting to login");
      // Clear auth tokens or session if needed
      toast.error("Session expired. Please login again.");
      // setTimeout(() => {
      //   localStorage.setItem("token", "false");
      //   window.location.href = "/login";    
      // }, 2000);       
      // window.location.href = "/login"; // or use `navigate()` if inside React component
      return;
    }
  
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Request failed with status ${res.status}`);
    }
  
    return res;
  }

  export default fetchWithAuth;


  