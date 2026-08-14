import { FaPlus, FaReddit, FaUser } from "react-icons/fa"
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react"
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Link, useNavigate } from "react-router-dom"


const Navbar = () => {
    const { user } = useUser()
    const navigate = useNavigate()

    return <nav className="bg-white h-[49px] fixed w-full top-0 border-b border-[#edeff1] z-[100]">
        <div className="h-full flex items-center justify-between px-5 mx-auto gap-2 w-full max-w-[1248px]">
            <Link to="/" className="flex items-center">
                <div className="flex items-center gap-2 px-2 py-0.5 cursor-pointer rounded hover:bg-[rgba(26,26,27,0.1)] min-w-fit">
                    <FaReddit className="w-8 h-8 text-[#FF4500]" />
                    <span className="text-[1.375rem] font-medium text-[#1c1c1c] whitespace-nowrap hidden md:inline">reddit</span>
                </div>
            </Link>

            <div>Searchbar</div>

            <div className="flex items-center gap-1 min-w-fit">

                {/* Unauthenticated */}
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="h-8 min-w-[80px] px-4 bg-[#FF4500] text-white text-sm font-bold border-none rounded-[20px] cursor-pointer whitespace-nowrap hover:bg-[#FF5722]">Sign In</button>
                    </SignInButton>

                </SignedOut>

                {/* Authenticated */}
                <SignedIn>
                    <div className="relative">
                        <button className="w-8 h-8 p-0 flex items-center justify-center bg-transparent border-none rounded-[2px] cursor-pointer hover:bg-[rgba(26,26,27,0.1)] [&_svg]:w-5 [&_svg]:h-5 [&_svg]:text-[#1c1c1c]" onClick={() => { }}>
                            <FaPlus/>
                        </button>

                        {/* dropdown container */}
                    </div>

                    {/*  Navigate to the user's profile page when the user icon is clicked */}
                    <button className="w-8 h-8 p-0 flex items-center justify-center bg-transparent border-none rounded-[2px] cursor-pointer hover:bg-[rgba(26,26,27,0.1)] [&_svg]:w-5 [&_svg]:h-5 [&_svg]:text-[#1c1c1c]" onClick={() => user?.username && navigate(`/u:${user.username}`)} title="View Profile">
                        <FaUser/>
                    </button>

                    <UserButton />
                </SignedIn>
            </div>
        </div>
    </nav>
}

export default Navbar
