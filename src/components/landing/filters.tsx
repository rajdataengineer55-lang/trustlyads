
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locations } from "@/lib/locations";
import { Button } from "../ui/button";

export type SortOption = 'newest' | 'trending';

interface FiltersProps {
    selectedLocation: string | null;
    setSelectedLocation: (location: string | null) => void;
    sortOption: SortOption;
    setSortOption: (option: SortOption) => void;
}

export function Filters({ selectedLocation, setSelectedLocation, sortOption, setSortOption }: FiltersProps) {
    
    const allSubLocations = locations.flatMap(l => l.subLocations || [l.name]);

    const handleClearFilters = () => {
        setSelectedLocation(null);
        setSortOption('newest');
    }

    return (
        <section id="filters" className="py-8 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:w-auto md:flex-1">
                        <Select onValueChange={(value) => setSelectedLocation(value === 'all' ? null : value)} value={selectedLocation || 'all'}>
                            <SelectTrigger className="w-full md:w-[280px]">
                                <SelectValue placeholder="Filter by Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {allSubLocations.map(loc => (
                                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-auto">
                        <Select onValueChange={(value) => setSortOption(value as SortOption)} value={sortOption}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="trending">Trending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {(selectedLocation || sortOption !== 'newest') && (
                        <div className="w-full md:w-auto">
                            <Button variant="ghost" onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
