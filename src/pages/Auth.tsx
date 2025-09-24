import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Github } from 'lucide-react';


const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = window.REACT_APP_CONFIG.API_BASE_URL || "";
  const googleLogin = window.REACT_APP_CONFIG.API_ENDPOINTS.GOOGLE_LOGIN || "/auth/google/login";

  const handleAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      // Mock successful auth - in real app this would handle OAuth flows
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        name: 'Admin',
        email: 'admin@example.com',
        avatar: ''
      }));
      
      setIsLoading(false);
      navigate('/hub-setup');
    }, 1500);
  };

  const handleGoogleLogin1 = () => {   
    //window.location.href = `${baseUrl1}${googleLogin}`;
    window.location.href = baseUrl+googleLogin; 
  
  };

  const handleGoogleLogin = async () => {
  
    try {
      console.log('Initiating Google OAuth login...');
     // updateStatus('Initiating login...', 'info');
     
      const response = await fetch(`${baseUrl}${googleLogin}`, {
          method: 'GET',
          credentials: 'include'
      });             
      console.log(`Response status: ${response.status}`);             
      if (response.ok) {
          const data = await response.json();
          console.log(`Received auth URL: ${data.auth_url}`);
          console.log(`State: ${data.state}`);
         
          // Store state for verification
          localStorage.setItem('oauth_state', data.state);
         
          // Redirect to Google OAuth
          window.location.href = data.auth_url;
      } else {
          const errorText = await response.text();
          throw new Error(`Login initiation failed: ${errorText}`);
      }
  } catch (error) {
    console.log(`Login initiation error: ${error.message}`, 'error');
     // updateStatus(`Login failed: ${error.message}`, 'error');
  }
}

     
     



  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          {/* <h1 className="text-4xl font-bold text-foreground">
            <span className="text-foreground">
              DevSecOps Platform
            </span>
            </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Security as an enabler, not a blocker
          </p> */}
        </div>

        {/* Auth Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            {/* <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Choose your preferred authentication method to continue
            </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleGoogleLogin()}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="w-full h-12 font-medium hover:shadow-md transition-smooth"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            
            <Button
              onClick={() => handleGoogleLogin1()}
              disabled={isLoading}
              variant="secondary"
              size="lg"
              className="w-full h-12 font-medium hover:shadow-md transition-smooth"
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;