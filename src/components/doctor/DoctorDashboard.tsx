import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDoctorQuery } from "@/hooks/useDoctorQuery";
import { useDoctorDataStore } from "@/stores/doctorDataStore"
import { Icon } from "@iconify/react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function DoctorDashboard() {
  const stat = useDoctorDataStore((state) => state.stat);
  useDoctorQuery();
  const stats = [
    {
      title: "Today's Appointments",
      value: stat.todaysAppointmentsCount,
      icon: "solar:calendar-outline",
      color: "text-primary",
    },
    {
      title: "This week",
      value: stat.weeklyAppointmentsCount,
      icon: "iconamoon:trend-up",
      color: "text-[#ED9200]",
    },
    {
      title: "Available Patients",
      value: stat.uniquePatientsToday,
      icon: "fluent:patient-32-regular",
      color: "text-[#8A38F5]",
    },
    {
      title: "Completed Today",
      value: stat.completedToday,
      icon: "octicon:tracked-by-closed-completed-16",
      color: "text-[#43A047]",
    },
  ]

  return (
    <div >
      <h1 className="text-2xl font-bold mb-8 text-foreground">Dashboard Analysis</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          return (
            <Card className="shadow-sm border border-border p-0" key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                    <p className="text-sm font-bold text-foreground">{stat.title}</p>
                  </div>
                  <div className="">
                    <Icon icon={stat.icon} className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Chart */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4">This Week's Schedule</h3>
          <Card className="border border-border bg-card h-fit">
            <CardContent>
              <ScheduleChart />
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="lg:col-span-1">
          <Card className="h-full shadow-none border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceMetrics />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity
        <div className="lg:col-span-1">
          <Card className="border border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div >
  )
}


function PerformanceMetrics() {
  const performance = useDoctorDataStore((state) => state.stat.performance);
  const metrics = [
    {
      label: "Total Appointments",
      sublabel: "All Time",
      value: performance.totalAppointments,
      color: "text-primary",
    },
    {
      label: "Completion Rate",
      sublabel: `${performance.totalCompleted} completed`,
      value: `${performance.completionRate}%`,
      color: "text-primary",
    },
    {
      label: "Cancellation Rate",
      sublabel: `${performance.totalCancelled} cancelled`,
      value: `${performance.cancellationRate}%`,
      color: "text-primary",
    },
    {
      label: "Prescriptions Issued",
      sublabel: "All Time",
      value: `${performance.prescriptionsIssued}`,
      color: "text-primary",
    },
  ]

  return (
    <div className="space-y-3 ">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="flex items-start justify-between bg-[#f9f9f9] p-4"
        >
          <div>
            <p className="font-semibold text-foreground">{metric.label}</p>
            <p className="text-sm text-muted-foreground">{metric.sublabel}</p>
          </div>
          <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
        </div>
      ))}
    </div>
  )
}

function ScheduleChart() {
  const data = useDoctorDataStore((state) => state.stat.chartData);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" stroke="var(--muted-foreground)" />
        <YAxis stroke="var(--muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: `1px solid var(--border)`,
            borderRadius: "0.5rem",
          }}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Bar dataKey="appointments" fill="var(--primary)" radius={[150, 150, 150, 150]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
