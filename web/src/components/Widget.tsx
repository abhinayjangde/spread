import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/user";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCallback } from "react";
import { graphqlClient } from "@/clients/api";
import { useQueryClient } from "@tanstack/react-query";

const Widget: React.FC = () => {
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();
    const handleSingInWithGoogle = useCallback(async (cred: CredentialResponse) => {
        const googleToken = cred.credential;
        if (!googleToken) {
            toast.error("Google sign-in failed. Please try again.");
            return;
        }
        const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, { token: googleToken })
        toast.success(`Welcome back!`);
        console.log(verifyGoogleToken);
        if (verifyGoogleToken) {
            localStorage.setItem("spread_token", verifyGoogleToken);
        }

        await queryClient.invalidateQueries({ queryKey: ["current_user"] });
    }, [user, queryClient]);
    return (
        <div className="col-span-4">
            {
                !user && <div className="m-4 p-4 border border-gray-400 rounded-lg">
                    <h2 className="font-bold text-2xl mb-4">New to Spread</h2>
                    <GoogleLogin onSuccess={(cred) => handleSingInWithGoogle(cred)} />
                </div>
            }

            <div className="m-4 p-4 border border-gray-400 rounded-lg">
                <h2 className="font-bold text-2xl mb-4">You might like</h2>
                <p>This is a placeholder for widgets like trends, suggestions, etc.</p>
            </div>
            <div className="m-4 p-4 border border-gray-400 rounded-lg">
                <h2 className="font-bold text-2xl mb-4">Widgets</h2>
                <p>This is a placeholder for widgets like trends, suggestions, etc.</p>
            </div>
            <div className="m-4 p-4 border border-gray-400 rounded-lg">
                <h2 className="font-bold text-2xl mb-4">What&apos;s happening</h2>
                <p>This is a placeholder for widgets like trends, suggestions, etc.</p>
            </div>
        </div>
    )
}

export default Widget