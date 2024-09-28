import { FC, ReactNode } from "react";
import { MailIcon } from "lucide-react";
import ScrollTo from "../ui/scrollTo";

interface LinkGroupProps {
  header: string;
  children: ReactNode;
}

interface NavLinkProps {
  link: string;
  label: string;
}

// LinkGroup Component with Explicit Types
const LinkGroup: FC<LinkGroupProps> = ({ header, children }) => (
  <div className="w-full px-4 sm:w-1/2 lg:w-3/12">
    <h4 className="mb-9 text-lg font-semibold text-dark dark:text-white">
      {header}
    </h4>
    <div>{children}</div>
  </div>
);

// NavLink Component with Explicit Types
const NavLink: FC<NavLinkProps> = ({ link, label }) => (
  <a href={link} className="text-base text-body-color hover:text-primary">
    {label}
  </a>
);

const Footer: FC = () => {
  return (
    <footer className="relative z-10 bg-white dark:bg-black pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px] rounded-lg">
      <div className="container">
        <div className="-mx-4 flex justify-between flex-wrap text-center sm:text-left">
          <div className="w-full px-4 sm:w-2/3 lg:w-3/12">
            <div className="mb-10 w-full">
              <a href="/#" className="mb-2 inline-block max-w-[160px]">
                <img
                  src="/HealersHealthcareOfficialLogo.png"
                  alt="logo"
                  className="max-w-full"
                />
              </a>
              <p className="flex items-center text-sm font-medium text-dark dark:text-white">
                <span className="flex items-center gap-2">
                  <MailIcon className="text-black dark:text-white" />
                  @ healershealthcare.in
                </span>
              </p>
            </div>
          </div>

          {/* Usage of LinkGroup with ScrollTo and NavLink */}
          <LinkGroup header="Company">
            <div className="flex flex-col gap-3">
              <ScrollTo to="aboutUs">About Healers</ScrollTo>
              <ScrollTo to="contactUs">Contact & Support</ScrollTo>
              <NavLink link="/#" label="Privacy Policy" />
            </div>
          </LinkGroup>

          <LinkGroup header="Quick Links">
            <div className="flex flex-col gap-3">
              <ScrollTo to="features">Our Features</ScrollTo>
              <ScrollTo to="faq">Queries</ScrollTo>
              <ScrollTo to="downloadMobileApp">Download App</ScrollTo>
              <ScrollTo to="clients">Our Clients</ScrollTo>
            </div>
          </LinkGroup>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
