import AdminNavbar from "@/components/AdminNavbar";

const Dashboard = async () => {
    return (
        <>
            <AdminNavbar />
            <div className="flex flex-col gap-12 items-center justify-center h-[calc(100dvh-100px)]">
                <p>Admin Page</p>
            </div>
        </>
    )
}

export default Dashboard