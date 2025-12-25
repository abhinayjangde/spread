"use client";
import Layout from "@/components/layout/layout";
import { useEffect, useState } from "react";

const UserProfile = ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const [id, setId] = useState<string>("");
    useEffect(() => {
        const getId = async () => {
            const { id } = await params;
            setId(id);
        }
        getId();
    }, [id, params]);

    return <>
        <Layout>
            <div className="col-span-5 h-screen overflow-y-auto no-scrollbar border-x border-gray-400">
                <div className="grid grid-cols-12 gap-4 border-t border-gray-400 p-4">
                    <h1>User Profile</h1>
                    <p>This is the profile page for user with ID: {id}</p>
                </div>
            </div>
        </Layout>
    </>;
};

export default UserProfile;