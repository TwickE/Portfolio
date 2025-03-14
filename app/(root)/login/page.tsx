import React from 'react'

const Login = () => {
    return (
        <main className="">
            <h1>Admin Dashboard</h1>
            <p>Enter your email below to login to your account</p>
            <form>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                />
                <button>Login</button>
            </form>
        </main>
    )
}

export default Login