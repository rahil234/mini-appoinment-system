import React, { useEffect, useState } from "react";
import { Calendar, Briefcase, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardAnalytics, RecentAppointment } from "@/types";
import { analyticsService } from "@/services/analytics.service.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [appointments, setAppointments] = useState<RecentAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await analyticsService.getDashboard();
        setData(response);

        setAppointments(response.recentAppointments);

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);


  const stats = data
    ? [
      {
        title: "Total Appointments",
        value: data.appointments.total.toString(),
        icon: Calendar,
        color: "text-primary",
        bg: "bg-primary/10"
      },
      {
        title: "Pending",
        value: data.appointments.pending.toString(),
        icon: Clock,
        color: "text-warning",
        bg: "bg-warning/10"
      },
      {
        title: "Confirmed",
        value: data.appointments.confirmed.toString(),
        icon: CheckCircle,
        color: "text-success",
        bg: "bg-success/10"
      },
      {
        title: "Cancelled",
        value: data.appointments.cancelled.toString(),
        icon: XCircle,
        color: "text-destructive",
        bg: "bg-destructive/10"
      }
    ]
    : [];

  const adminStats =
    isAdmin && data?.cases
      ? [
        {
          title: "Total Cases",
          value: data.cases.total.toString(),
          icon: Briefcase,
          color: "text-accent-foreground",
          bg: "bg-accent"
        },
        {
          title: "Unassigned Cases",
          value: data.cases.unassigned.toString(),
          icon: AlertCircle,
          color: "text-warning",
          bg: "bg-warning/10"
        }
      ]
      : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-success/10 text-success";
      case "PENDING":
        return "bg-warning/10 text-warning";
      case "CANCELLED":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your appointment management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Stats */}
      {isAdmin && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {adminStats.map((stat, index) => (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${(index + 4) * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Appointments */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Appointments</CardTitle>
          <CardDescription>
            Your upcoming scheduled appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
