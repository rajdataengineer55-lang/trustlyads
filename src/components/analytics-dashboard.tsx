
"use client";

import { useOffers } from "@/contexts/OffersContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { useMemo, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { TrendingUp, PieChart as PieChartIcon, SlidersHorizontal, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "./ui/select";
import { locations } from "@/lib/locations";
import { categories as categoryOptions } from "@/lib/categories";
import { Button } from "./ui/button";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1'];

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} offers`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
};

export function AnalyticsDashboard() {
    const { offers, loading } = useOffers();
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const filteredOffers = useMemo(() => {
        let filtered = offers;

        if (selectedLocation) {
            const mainLocation = locations.find(loc => loc.name === selectedLocation && loc.subLocations);
            if (mainLocation?.subLocations) {
                const locationsToShow = [mainLocation.name, ...mainLocation.subLocations];
                filtered = filtered.filter(offer => locationsToShow.includes(offer.location));
            } else {
                filtered = filtered.filter(offer => offer.location === selectedLocation);
            }
        }

        if (selectedCategory) {
            filtered = filtered.filter(offer => offer.category === selectedCategory);
        }

        return filtered;
    }, [offers, selectedLocation, selectedCategory]);


    const performanceData = useMemo(() => {
        return filteredOffers
            .map(offer => ({
                name: offer.title,
                views: offer.views || 0,
                clicks: offer.clicks || 0,
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 15); // Show top 15 most viewed
    }, [filteredOffers]);

    const categoryData = useMemo(() => {
        const categoryCounts = filteredOffers.reduce((acc, offer) => {
            acc[offer.category] = (acc[offer.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
    }, [filteredOffers]);
    
    const handleClearFilters = () => {
        setSelectedLocation(null);
        setSelectedCategory(null);
    }
    const hasActiveFilters = selectedLocation || selectedCategory;

    if (loading) {
        return (
            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-80 w-full" />
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-80 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                    Visualize your ad performance and audience engagement.
                </p>
            </div>
            
             <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><SlidersHorizontal /> Filters</CardTitle>
                    <CardDescription>Drill down into your data by location and category.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                     <Select onValueChange={(value) => setSelectedLocation(value === 'all' ? null : value)} value={selectedLocation || 'all'}>
                        <SelectTrigger><SelectValue placeholder="Filter by Location" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {locations.map((location) => location.subLocations ? (
                                <SelectGroup key={location.name}>
                                    <SelectLabel>{location.name}</SelectLabel>
                                    <SelectItem value={location.name}>All of {location.name}</SelectItem>
                                    {location.subLocations.map((sub) => (
                                        <SelectItem key={`${location.name}-${sub}`} value={sub}>{sub}</SelectItem>
                                    ))}
                                </SelectGroup>
                            ) : (
                                <SelectItem key={location.name} value={location.name}>{location.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)} value={selectedCategory || 'all'}>
                        <SelectTrigger><SelectValue placeholder="Filter by Category" /></SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Categories</SelectItem>
                           {categoryOptions.map(cat => (
                                <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                           ))}
                        </SelectContent>
                    </Select>
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={handleClearFilters}>
                            <X className="mr-2 h-4 w-4" /> Clear
                        </Button>
                    )}
                </CardContent>
            </Card>


            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp />
                            Top Ad Performance
                        </CardTitle>
                        <CardDescription>Views and clicks for the top {performanceData.length} ads based on current filters.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {performanceData.length > 0 ? (
                             <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} interval={0} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="views" fill="#8884d8" name="Views" />
                                    <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-80 text-muted-foreground">
                                No ad performance data for the selected filters.
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon />
                            Offer Distribution by Category
                        </CardTitle>
                        <CardDescription>How ads are distributed across categories based on current filters.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {categoryData.length > 0 ? (
                         <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                >
                                     {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                       ) : (
                            <div className="flex items-center justify-center h-80 text-muted-foreground">
                                No category data for the selected filters.
                            </div>
                       )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
