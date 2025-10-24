import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Shield, CreditCard, Activity, FileSearch, Home, ArrowRight } from 'lucide-react';

export default function AdminAgentsPage() {
  const agents = [
    {
      slug: 'user-management',
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      color: 'teal',
      available: true,
    },
    {
      slug: 'platform-analytics',
      title: 'Platform Analytics',
      description: 'Monitor platform-wide metrics and trends',
      icon: TrendingUp,
      color: 'teal',
      available: true,
    },
    {
      slug: 'content-moderator',
      title: 'Content Moderator',
      description: 'Review and moderate flagged content',
      icon: Shield,
      color: 'teal',
      available: true,
    },
    {
      slug: 'billing-manager',
      title: 'Billing Manager',
      description: 'Track subscriptions and revenue',
      icon: CreditCard,
      color: 'teal',
      available: true,
    },
    {
      slug: 'system-monitor',
      title: 'System Monitor',
      description: 'Monitor system health and performance',
      icon: Activity,
      color: 'teal',
      available: true,
    },
    {
      slug: 'audit-logger',
      title: 'Audit Logger',
      description: 'Track and review system audit logs',
      icon: FileSearch,
      color: 'teal',
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-teal-600">
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-teal-600">RecruitEdge</h1>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Admin Agents
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Powerful tools for platform administration and monitoring
        </p>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isAvailable = agent.available;
            
            return (
              <Card 
                key={agent.slug} 
                className={`hover:shadow-lg transition-shadow ${
                  !isAvailable ? 'opacity-60' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-10 h-10 text-teal-600" />
                    {!isAvailable && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl">{agent.title}</CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isAvailable ? (
                    <Link
                      to={`/admin-agents/${agent.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      Open Agent <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
