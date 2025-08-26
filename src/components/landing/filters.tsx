
"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locations } from "@/lib/locations";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { categories } from "@/lib/categories";

export type SortOption = 'newest' | 'trending';

interface FiltersProps {
    selectedLocation: string | null;
    setSelectedLocation: (location: string | null) => void;
    sortOption: SortOption;
    setSortOption: (option: SortOption) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    categories: { name: string }[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export function Filters({ 
    selectedLocation, 
    setSelectedLocation, 
    sortOption, 
    setSortOption,
    selectedCategory,
    setSelectedCategory,
    categories: filterCategories,
    searchTerm,
    setSearchTerm
}: FiltersProps) {
    
    const handleClearFilters = () => {
        setSelectedLocation(null);
        setSelectedCategory(null);
        setSortOption('newest');
        setSearchTerm('');
    }

    const hasActiveFilters = selectedLocation || selectedCategory || sortOption !== 'newest' || searchTerm;

    return (
        <section id="filters" className="py-8 bg-background/50 border-t border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
                    <div className="w-full lg:col-span-2 md:col-span-3 sm:col-span-2">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="search-filters"
                                type="search"
                                placeholder="Search offers by name, business, or tag..."
                                className="w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)} value={selectedCategory || 'all'}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {filterCategories.map(cat => (
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
                         <Select onValueChange={(value: SortOption) => setSortOption(value)} value={sortOption}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Sort by Newest</SelectItem>
                                <SelectItem value="trending">Sort by Trending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {hasActiveFilters && (
                        <div className="w-full text-center sm:col-span-2 md:col-span-3 lg:col-span-5">
                            <Button variant="ghost" onClick={handleClearFilters}>
                                <X className="mr-2 h-4 w-4" />
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
