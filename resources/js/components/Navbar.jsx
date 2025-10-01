import { useState } from "react";
import { Link } from "@inertiajs/react";
import Logo from "../assets/images/logo.png";
import { ReactComponent as MenuIcon } from "../assets/icons/menu.svg";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/Syllabus", label: "Syllabus" },
    { href: "/About", label: "About" },
  ];

  const authLinks = [
    { href: "/Signup", label: "Signup" },
    { href: "/Login", label: "Login" },
  ];

  return (
    <header className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={Logo} alt="Logo" className="h-10 w-auto" />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex gap-8 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-Headline hover:text-primary px-1
                           after:content-[''] after:absolute after:left-0 after:bottom-0.5
                           after:h-[2px] after:bg-primary after:transition-all after:duration-300
                           after:w-0 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex gap-4 ml-8">
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-Headline hover:text-primary px-2 py-1 border rounded"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col divide-y divide-gray-300">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-Headline hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex justify-around mt-4 mb-4">
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-gray-200 rounded text-Headline hover:bg-primary hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
