"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locations } from "@/lib/locations";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { categories as categoryData } from "@/lib/categories"; 

export type SortOption = 'newest' | 'trending';

interface FiltersProps {
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    sortOption: SortOption;
    setSortOption: (option: SortOption) => void;
}

export function Filters({ 
    selectedCategory,
    setSelectedCategory,
    sortOption, 
    setSortOption,
}: FiltersProps) {
    
    const handleClearFilters = () => {
        setSelectedCategory(null);
        setSortOption('newest');
    }

    const hasActiveFilters = selectedCategory || sortOption !== 'newest';

    return (
        <section id="filters" className="py-4 bg-background/50 border-b">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)} value={selectedCategory || 'all'}>
                            <SelectTrigger className="w-full">
                                 <SlidersHorizontal className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categoryData.map(cat => (
                                    <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="flex-1">
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
                        <div className="w-full sm:w-auto">
                            <Button variant="ghost" onClick={handleClearFilters} className="w-full">
                                <X className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
