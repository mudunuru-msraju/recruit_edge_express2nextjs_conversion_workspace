/**
 * Temporary Authentication Page
 * Placeholder for Auth.js integration with Google OAuth
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <CardTitle className="text-2xl">
                {mode === 'login' ? 'Sign In' : 'Get Started'}
              </CardTitle>
            </div>
            <CardDescription>
              Authentication is coming soon! We're integrating Auth.js with Google OAuth.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>For now, you can explore the platform without authentication:</strong>
              </p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Browse agent categories</li>
                <li>Try the Resume Builder agent</li>
                <li>Explore all features</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Link to="/job-seeker-agents">
                <Button className="w-full" size="lg">
                  Explore Job Seeker Agents
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="w-full" size="lg">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                Authentication will include: Google OAuth, role selection (Job Seeker/Recruiter/Admin), 
                and secure session management with Auth.js
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
