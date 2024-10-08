"use client";

import React, { useEffect, useState } from "react";
import { userDetails } from "../../action/userDetails";
import Loading from "../../components/loading";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Star } from "lucide-react";
import Link from "next/link";
import Organisedevent from "@/components/Organisedevent";
import Participatedevent from "@/components/Participatedevent";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend as RadialLegend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  BarChart,
  Bar,
  Label,
  AreaChart,
  Area,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface User {
  id: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
}


export const description = "A donut chart with text"
const chartData = [
  { browser: "technical", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "sports", visitors: 200, fill: "var(--color-safari)" },
  { browser: "cultural", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "meetup", visitors: 173, fill: "var(--color-edge)" },
  { browser: "conference", visitors: 190, fill: "var(--color-other)" },
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const totalEventsData = [
  { name: 'Conferences', value: 30 },
  { name: 'Workshops', value: 45 },
  { name: 'Seminars', value: 25 },
  { name: 'Conferences', value: 30 },
  { name: 'Workshops', value: 45 },
  { name: 'Seminars', value: 25 },
]

const totalAttendeesData = [
  { name: 'Online', value: 1200 },
  { name: 'In-person', value: 800 },
]

const avgRatingData = [
  { category: 'Content', rating: 4.5 },
  { category: 'Speakers', rating: 4.7 },
  { category: 'Organization', rating: 4.2 },
  { category: 'Venue', rating: 4.0 },
]

const engagementRateData = [
  { month: 'Jan', rate: 65 },
  { month: 'Feb', rate: 59 },
  { month: 'Mar', rate: 80 },
  { month: 'Apr', rate: 72 },
  { month: 'May', rate: 78 },
  { month: 'Jun', rate: 85 },
]


const chartData2 = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
const chartConfig2 = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

const chartConfig3 = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [activeTab, setActiveTab] = useState("organized");
  const [organisedEvent, setOrganisedEvent]: any = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])
  useEffect(() => {
    userDetails()
      .then((res: any) => {
        setUser(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setUser(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const organizeEvents: any = async () => {
      let { data: organised_events, error } = await supabase
        .from("event_details")
        .select("*")
        .eq("organizer_email", user?.email);

      if (error) {
        console.log(error);
      }
      {
        setLoading(true);
        setOrganisedEvent(organised_events);
        setLoading(false);
      }
    };

    organizeEvents();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <>
      <div className="  w-full h-auto bg-black text-white py-[8rem] flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col justify-start items-center gap-24 md:border md:border-white rounded-md p-10">
            <h1 className="text-center text-4xl font-bold">Your Profile</h1>
            {loading ? (
              <Loading />
            ) : user ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <Image
                  src={user.picture || "/profile.jpg"}
                  alt={`${user.given_name} ${user.family_name}`}
                  width={96}
                  height={96}
                  className="rounded-full border-2 border-white"
                />
                <h1>
                  {user.given_name} {user.family_name}
                </h1>
                <h2>{user.email}</h2>
                <LogoutLink
                  className="mono transition ease-in-out delay-100 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md px-4 py-1"
                  postLogoutRedirectURL="/"
                >
                  Log out
                </LogoutLink>
              </div>
            ) : (
              <h1>No user details available</h1>
            )}
          </div>

          <div className="flex-grow space-y-8">
            <div className="w-full p-2 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {/* Total Events */}
                <Card className="flex flex-col">
                  <CardHeader className="items-center pb-0">
                    <CardTitle>Total Events</CardTitle>
                    {/* <CardDescription>January - June 2024</CardDescription> */}
                  </CardHeader>
                  <CardContent className="flex-1 pb-0">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[250px]"
                    >
                      <PieChart>
                        <ChartTooltip 
                          cursor={false}
                          content={<ChartTooltipContent hideLabel className="bg-black" />}
                        />
                        <Pie
                          data={chartData}
                          dataKey="visitors"
                          nameKey="browser"
                          innerRadius={60}
                          strokeWidth={5}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    <tspan
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      className="fill-white text-3xl font-bold"
                                    >
                                      {totalVisitors.toLocaleString()}
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) + 24}
                                      className="fill-white"
                                    >
                                      Visitors
                                    </tspan>
                                  </text>
                                )
                              }
                            }}
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                  {/* <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Showing total visitors for the last 6 months
                    </div>
                  </CardFooter> */}
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Total Attendes</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-2 md:mt-4">
                    <ChartContainer config={chartConfig2}>
                      <AreaChart
                        accessibilityLayer
                        data={chartData2}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 3)}
                          
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" className="bg-black"/>}
                        />
                        <Area
                          dataKey="mobile"
                          type="natural"
                          fill="var(--color-mobile)"
                          // fillOpacity={0.2}
                          stroke="var(--color-mobile)"
                          stackId="a"
                        />
                        <Area
                          dataKey="desktop"
                          type="natural"
                          fill="var(--color-desktop)"
                          // fillOpacity={0.2}
                          stroke="var(--color-desktop)"
                          stackId="a"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Average Rating</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-2 md:mt-4">
                    <ChartContainer config={chartConfig2}>
                      <BarChart
                        accessibilityLayer
                        data={chartData2}
                        layout="vertical"
                        margin={{
                          right: 20,
                        }}
                      >
                        <YAxis
                          dataKey="month"
                          type="category"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 3)}
                          hide
                        />
                        <XAxis dataKey="desktop" type="number" hide />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="line" className="bg-black"/>}
                        />
                        <Bar
                          dataKey="desktop"
                          layout="vertical"
                          fill="var(--color-desktop)"
                          radius={4}
                        >
                          <LabelList
                            dataKey="month"
                            position="insideLeft"
                            offset={8}
                            className="fill-[--color-label]"
                            fontSize={12}
                          />
                          <LabelList
                            dataKey="desktop"
                            position="right"
                            offset={8}
                            className="fill-foreground"
                            fontSize={12}
                          />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Engagement Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-2 md:mt-4">
                    <ChartContainer config={chartConfig3}>
                      <LineChart
                        accessibilityLayer
                        data={chartData2}
                        margin={{
                          top: 20,
                          left: 12,
                          right: 12,
                        }}
                      >
                        {/* <CartesianGrid vertical={false} /> */}
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="line" className="bg-black"/>}
                        />
                        <Line
                          dataKey="desktop"
                          type="natural"
                          stroke="var(--color-desktop)"
                          strokeWidth={2}
                          dot={{
                            fill: "var(--color-desktop)",
                          }}
                          activeDot={{
                            r: 6,
                          }}
                        >
                          <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                          />
                        </Line>
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-4">
              <Button variant="outline" className="w-full">
                <Link href="/add-event">Organised Your Own Event</Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Link href="/explore-events">View All Events</Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Link href="/explore-event-space">
                  Find Space For Your Next Event
                </Link>
              </Button>
            </div>

            <div>
              <Button variant="outline" className="w-full">
                <Link href="/manage-event">Manage Your Events</Link>
              </Button>
            </div>

            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted">
                <div className="flex flex-col gap-8 md:flex-row justify-between items-center">
                  <CardTitle>Your Events</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={
                        activeTab === "organized" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveTab("organized")}
                    >
                      Organized
                    </Button>
                    <Button
                      variant={
                        activeTab === "participated" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveTab("participated")}
                    >
                      Participated
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className={`${loading ? `h-auto` : `p-0`}`}>
                <div className="divide-y">
                  {activeTab === "organized" ? (
                    <Organisedevent eventDetails={organisedEvent} />
                  ) : (
                    <Participatedevent email={user?.email} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main >
      </div >
    </>
  ) : (
    router.push("/unauthorized")
  );
}
