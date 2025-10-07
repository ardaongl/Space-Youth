import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { setUserToken } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";
import { apis } from "@/services";
const baseUrl = import.meta.env.VITE_BASE_URL;
interface AboutResponse {
  message: string;
}


export default function About() {
  const [response, setResponse] = useState<AboutResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      //const response = await login("dev.berat55@gmail.com", "123456");
      const response = await apis.user.login("dev.berat55@gmail.com", "123456");
      console.log(response);
      
      dispatch(setUserToken(response.data.auth_token));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAboutData = async () => {
    setLoading(true);
    setError(null);
    
    try {

      const res = await apis.common.about();
      console.log(res);
    
      
      console.log("🎉 Response received from Space Youth API:", res);
      console.log("📅 Response timestamp:", new Date().toISOString());
      console.log("💬 API Message:", res.message);
      setResponse(res);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("❌ Error fetching data from Space Youth API:", errorMessage);
      console.error("🔍 Full error object:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    const response = await apis.course.getAllCourses();
    console.log(response);
    
  }

  useEffect(() => {
    // Automatically fetch data when component mounts
    fetchAboutData();
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About Page</h1>
          <div>
            <button
              onClick={handleLogin}
            >
              login!
            </button>
          </div>
          <div className="bg-card border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Space Youth API Test</h2>            
            <Button 
              onClick={fetchAboutData} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? "Loading..." : "Refresh Request"}
            </Button>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {response && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Response from Space Youth API:</h3>
                <div className="text-green-700 text-lg font-medium mb-2">
                  {response.message}
                </div>
                <details className="mt-2">
                  <summary className="text-sm text-green-600 cursor-pointer">Show raw JSON</summary>
                  <pre className="text-green-700 text-sm overflow-auto mt-2 bg-green-100 p-2 rounded">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
        <div>
        <Button 
              onClick={handleLogin} 
              disabled={loading}
              className="mb-4"
            >
              login ol
        </Button>
        <Button 
              onClick={fetchCourses} 
              disabled={loading}
              className="mb-4"
            >
              kursları getir
        </Button>
        </div>
      </div>
    </AppLayout>
  );
}
