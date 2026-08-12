import { FaPlus, FaReddit, FaUser } from "react-icons/fa"
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/clerk-react"
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import "../styles/Navbar.css"


const Navbar = () => {
    const { user } = useUser()
    const navigate = useNavigate()

    return <nav className="navbar">
        <div className="navbar-content">
            <Link to="/" className="navbar-logo">
                <div className="logo-container">
                    <FaReddit className="reddit-icon" />
                    <span className="site-name">reddit</span>
                </div>
            </Link>

            <div>Searchbar</div>

            <div className="nav-actions">

                {/* Unauthenticated */}
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="sign-in-button">Sign In</button>
                    </SignInButton>

                </SignedOut>

                {/* Authenticated */}
                <SignedIn>
                    <div className="dropdown-container">
                        <button className="icon-button" onClick={() => { }}>
                            <FaPlus/>
                        </button>

                        {/* dropdown container */}
                    </div>

                    {/*  Navigate to the user's profile page when the user icon is clicked */}
                    <button className="icon-button" onClick={() => user?.username && navigate(`/u:${user.username}`)} title="View Profile">
                        <FaUser/>
                    </button>

                    <UserButton />
                </SignedIn>
            </div>
        </div>
    </nav>
}

export default Navbar