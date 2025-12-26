import Sidebar from "@/components/Sidebar";
import Widget from "@/components/Widget";

const Layout: React.FC<{ children: React.ReactNode }> = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <div className="flex flex-col min-h-screen w-full lg:grid lg:grid-cols-12 lg:px-4 xl:px-24 2xl:px-56">
            {/* Sidebar - Fixed bottom on mobile, side column on desktop */}
            <Sidebar />

            {/* Feed - Dynamic Content */}
            <div className="flex-1 pb-16 lg:pb-0 lg:col-span-7 xl:col-span-6 h-screen overflow-y-auto no-scrollbar lg:border-x border-gray-400">
                {children}
            </div>

            {/* Widgets - Hidden on mobile/tablet */}
            <Widget />
        </div>
    )
}

export default Layout