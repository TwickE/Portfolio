import { logOutAdmin } from "@/lib/actions/admin.actions";
import { checkAdminAuth } from "@/lib/actions/admin.actions";
const Dashboard = async () => {
    // This will redirect the user to the login page if not authenticated
    await checkAdminAuth({ shouldRedirect: true });

    return (
        <div className="flex flex-col gap-12 items-center justify-center h-screen">
            <p>Admin Page</p>
            <form action={async () => {
                "use server";

                await logOutAdmin();
            }}>
                <button type='submit'className="p-3 bg-primary">End Session</button>
            </form>
        </div>
    )
}

export default Dashboard