import {Outlet} from "react-router-dom"
import Navbar from "./Navbar"

const Layout = () => {
    return(
        <div className="app-container">
            <Navbar />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout