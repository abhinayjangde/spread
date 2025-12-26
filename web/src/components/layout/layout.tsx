import Sidebar from "@/components/Sidebar";
import Widget from "@/components/Widget";

const Layout: React.FC<{ children: React.ReactNode }> = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
            {/* Sidebar  */}
            <Sidebar />

            {/* Feed - Dynamic Content  */}
            <div className="col-span-10 sm:col-span-5 h-screen overflow-y-auto no-scrollbar border-x border-gray-400">

                {children}
            </div>

            {/* Widgets  */}
            <Widget />
        </div>
    )
}

export default Layout