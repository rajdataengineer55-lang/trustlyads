
"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locations } from "@/lib/locations";
import { Button } from "@/components/ui/button";

export type SortOption = 'newest' | 'trending';

interface FiltersProps {
    selectedLocation: string | null;
    setSelectedLocation: (location: string | null) => void;
    sortOption: SortOption;
    setSortOption: (option: SortOption) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    categories: { name: string }[];
}

export function Filters({ 
    selectedLocation, 
    setSelectedLocation, 
    sortOption, 
    setSortOption,
    selectedCategory,
    setSelectedCategory,
    categories
}: FiltersProps) {
    
    const handleClearFilters = () => {
        setSelectedLocation(null);
        setSelectedCategory(null);
        setSortOption('newest');
    }

    const hasActiveFilters = selectedLocation || selectedCategory || sortOption !== 'newest';

    return (
        <section id="filters" className="py-8 bg-background/50 border-t border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div className="w-full">
                        <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)} value={selectedCategory || 'all'}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="w-full">
                        <Select onValueChange={(value) => setSelectedLocation(value === 'all' ? null : value)} value={selectedLocation || 'all'}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter by Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {locations.map((location) =>
                                    location.subLocations ? (
                                    <SelectGroup key={location.name}>
                                        <SelectLabel>{location.name}</SelectLabel>
                                        {location.subLocations.map((sub) => (
                                        <SelectItem key={`${location.name}-${sub}`} value={sub}>
                                            {sub}
                                        </SelectItem>
                                        ))}
                                    </SelectGroup>
                                    ) : (
                                    <SelectItem key={location.name} value={location.name}>
                                        {location.name}
                                    </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full">
                        <Select onValueChange={(value) => setSortOption(value as SortOption)} value={sortOption}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="trending">Trending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {hasActiveFilters && (
                        <div className="w-full text-center md:text-left">
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
