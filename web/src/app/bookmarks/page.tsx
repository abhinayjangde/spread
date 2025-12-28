"use client"
import Layout from '@/components/layout/layout'


const Bookmarks = () => {

    return (
        <Layout>
            <div className="flex flex-col min-h-screen">
                {/* Search Header */}
                <div className="sticky top-0 z-10  bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 pt-2 pb-0 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between gap-3 pb-4">
                        <h2 className="text-xl font-bold">Bookmarks</h2>
                    </div>
                </div>



            </div>
        </Layout>
    )
}

export default Bookmarks