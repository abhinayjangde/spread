import React from 'react';

// Base Shimmer Component
export const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`animate-shimmer bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 bg-size-[200%_100%] rounded ${className}`} />
    );
};

// Feed Card Skeleton
export const FeedCardSkeleton: React.FC = () => {
    return (
        <div className="flex gap-3 sm:gap-4 border-t border-gray-200 dark:border-zinc-800 p-3 sm:p-4">
            {/* Avatar */}
            <div className="shrink-0">
                <Shimmer className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-3">
                {/* Name and time */}
                <div className="flex items-center gap-2">
                    <Shimmer className="h-4 w-24 sm:w-32" />
                    <Shimmer className="h-3 w-16" />
                </div>

                {/* Content lines */}
                <div className="space-y-2">
                    <Shimmer className="h-4 w-full" />
                    <Shimmer className="h-4 w-3/4" />
                </div>

                {/* Action buttons */}
                <div className="flex gap-8 sm:gap-12 mt-3">
                    <Shimmer className="h-6 w-6 rounded-full" />
                    <Shimmer className="h-6 w-6 rounded-full" />
                    <Shimmer className="h-6 w-6 rounded-full" />
                    <Shimmer className="h-6 w-6 rounded-full" />
                </div>
            </div>
        </div>
    );
};

// Multiple Feed Cards Skeleton
export const FeedSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <FeedCardSkeleton key={index} />
            ))}
        </>
    );
};

// Profile Page Skeleton
export const ProfileSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            {/* Header Skeleton */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
                <nav className="flex items-center gap-4 sm:gap-6 p-2 sm:p-3">
                    <Shimmer className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                    <div className="space-y-2">
                        <Shimmer className="h-5 w-28 sm:w-36" />
                        <Shimmer className="h-3 w-16" />
                    </div>
                </nav>
            </header>

            {/* Cover Photo */}
            <Shimmer className="h-24 sm:h-32 md:h-40 lg:h-48 w-full rounded-none" />

            {/* Profile Info Section */}
            <div className="px-3 sm:px-4 pb-4">
                {/* Avatar */}
                <div className="relative -mt-12 sm:-mt-16 mb-3">
                    <Shimmer className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-black" />
                </div>

                {/* User Info */}
                <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                        <Shimmer className="h-6 sm:h-8 w-40 sm:w-48" />
                        <Shimmer className="h-4 w-24" />
                    </div>

                    <Shimmer className="h-4 w-36" />

                    <div className="flex gap-4 sm:gap-6">
                        <Shimmer className="h-4 w-20" />
                        <Shimmer className="h-4 w-20" />
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex border-b border-gray-200 dark:border-zinc-800">
                <div className="flex-1 py-3 sm:py-4 flex justify-center">
                    <Shimmer className="h-4 w-12" />
                </div>
                <div className="flex-1 py-3 sm:py-4 flex justify-center">
                    <Shimmer className="h-4 w-14" />
                </div>
                <div className="flex-1 py-3 sm:py-4 flex justify-center">
                    <Shimmer className="h-4 w-10" />
                </div>
            </div>

            {/* Posts Skeleton */}
            <FeedSkeleton count={3} />
        </div>
    );
};

// Post Composer Skeleton
export const ComposerSkeleton: React.FC = () => {
    return (
        <div className="flex gap-3 sm:gap-4 border-b border-gray-200 dark:border-zinc-800 p-3 sm:p-4">
            <div className="shrink-0 hidden sm:block">
                <Shimmer className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
                <Shimmer className="h-16 sm:h-20 w-full rounded-lg" />
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex gap-3">
                        <Shimmer className="h-6 w-6 rounded" />
                        <Shimmer className="h-6 w-6 rounded" />
                    </div>
                    <Shimmer className="h-8 w-16 sm:w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
};

// Widget Skeleton
export const WidgetSkeleton: React.FC = () => {
    return (
        <div className="m-3 xl:m-4 p-3 xl:p-4 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
            <Shimmer className="h-6 w-32 mb-4" />
            <div className="space-y-3">
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-3/4" />
            </div>
        </div>
    );
};

// Sidebar User Skeleton
export const SidebarUserSkeleton: React.FC = () => {
    return (
        <div className="mb-4 flex gap-3 py-2 px-2 rounded-full items-center">
            <Shimmer className="w-10 h-10 rounded-full" />
            <div className="hidden xl:flex flex-col gap-2">
                <Shimmer className="h-4 w-20" />
                <Shimmer className="h-3 w-28" />
            </div>
        </div>
    );
};

// Mobile Header Skeleton
export const MobileHeaderSkeleton: React.FC = () => {
    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 lg:hidden">
            <div className="flex items-center justify-between p-3">
                <Shimmer className="w-8 h-8 rounded-full" />
                <Shimmer className="h-5 w-16" />
                <div className="w-8" />
            </div>
        </header>
    );
};

export default Shimmer;
