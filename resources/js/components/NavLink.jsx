import { Link, usePage } from "@inertiajs/react";

export default function NavLink({ href, children, onClick }) {
  const { url } = usePage();

  const isActive = url === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
       relative
       mt-4
       text-Headline
       hover:text-primary
      ${isActive ? "text-primary" : "text-Headline"}
        after:content-['']
        after:absolute
        after:left-0
        after:-bottom-0
        after:h-[2px]
        after:bg-primary
        after:transition-all
        after:duration-300
        ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
      `}
    >
      {children}
    </Link>
  );
}
