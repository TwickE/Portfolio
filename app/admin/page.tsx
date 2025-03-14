import { logOutAdmin } from "@/lib/actions/admin.actions";

const Dashboard = () => {
    return (
        <div>
            <p>Admin Page</p>
            <form action={async () => {
                "use server";

                console.log('Logging out admin');

                await logOutAdmin();
            }}>
                <button type='submit'>End Session</button>
            </form>
        </div>
    )
}

export default Dashboard