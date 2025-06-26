import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, TrendingUp, AlertCircle, CheckCircle, Loader2, Mail, Lock, User, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Handle redirect after user is authenticated
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User already logged in, redirecting to dashboard');
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    console.log('Signup form submitted');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName,
        formData.company
      );
      
      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes("already registered")) {
          setError("An account with this email already exists. Please sign in instead.");
        } else if (error.message.includes("Password")) {
          setError("Password is too weak. Please choose a stronger password.");
        } else {
          setError(error.message);
        }
      } else if (data?.user) {
        console.log('Signup successful');
        if (data.user.email_confirmed_at) {
          // Email already confirmed, redirect to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          // Show success message for email confirmation
          setSuccess("Account created successfully! Please check your email for a confirmation link.");
        }
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-600 bg-clip-text text-transparent">
                SupplyMantix
              </span>
            </Link>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent mb-2">
              Get started
            </h2>
            <p className="text-gray-500">Create your account in seconds</p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-center font-bold text-gray-900">Create Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 rounded-xl">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="h-11 pl-10 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="h-11 pl-10 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-11 pl-11 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="company"
                    type="text"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="h-11 pl-11 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-11 pl-11 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="h-11 pl-11 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="flex items-start space-x-3 pt-2">
                  <input type="checkbox" id="terms" className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" required />
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-emerald-600 hover:text-emerald-500 font-medium">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-emerald-600 hover:text-emerald-500 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <span className="text-gray-600">Already have an account? </span>
                <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-semibold">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Enhanced Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated pattern background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative max-w-lg text-center text-white z-10">
          <div className="w-32 h-32 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl">
            <TrendingUp className="w-16 h-16 text-white animate-pulse" />
          </div>
          <h3 className="text-4xl font-bold mb-4">Transform Your Business</h3>
          <p className="text-emerald-100 text-xl leading-relaxed mb-8 opacity-90">
            Real-time insights and automated workflows for operational excellence
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
              <span className="text-emerald-100 text-lg">14-day free trial</span>
            </div>
            <div className="flex items-center space-x-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
              <span className="text-emerald-100 text-lg">No credit card required</span>
            </div>
            <div className="flex items-center space-x-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
              <span className="text-emerald-100 text-lg">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
