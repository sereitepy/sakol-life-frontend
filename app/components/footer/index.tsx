import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Link2, Mail } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Take the Quiz", href: "/quiz" },
  { label: "Majors", href: "/majors" },
  { label: "Universities", href: "/universities" },
  { label: "Scholarships", href: "/scholarships" },
];

const supportLinks = [
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-chart-3/20 dark:bg-[oklch(0.3_0.06_148)] text-secondary-foreground dark:text-white/80">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-secondary-foreground/10 dark:bg-white/10 rounded-lg p-2">
              <GraduationCap className="w-5 h-5 text-secondary-foreground dark:text-white" />
            </div>
            <span className="text-secondary-foreground dark:text-white font-semibold text-lg">
              Sakol Life
            </span>
          </div>
          <p className="text-sm leading-relaxed text-secondary-foreground/60 dark:text-white/60">
            Guiding Cambodian students toward a brighter future in technology
            and innovation. Our mission is to bridge the gap between passion and
            professional success through expert academic counseling.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-secondary-foreground dark:text-white font-semibold text-base">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="underline-animate text-sm text-secondary-foreground/60 dark:text-white/60 hover:text-secondary-foreground dark:hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-4">
          <h3 className="text-secondary-foreground dark:text-white font-semibold text-base">
            Support
          </h3>
          <ul className="flex flex-col gap-2">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="underline-animate text-sm text-secondary-foreground/60 dark:text-white/60 hover:text-secondary-foreground dark:hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="flex flex-col gap-4">
          <h3 className="text-secondary-foreground dark:text-white font-semibold text-base">
            Connect With Us
          </h3>
          <div className="flex items-center gap-3">
            <a
              href="https://sakol-life-google-site.vercel.app"
              className="bg-secondary-foreground/10 dark:bg-white/10 hover:bg-secondary-foreground/20 dark:hover:bg-white/20 transition-colors duration-200 rounded-lg p-2"
              aria-label="Website"
            >
              <Link2 className="w-4 h-4 text-secondary-foreground dark:text-white" />
            </a>
            <a
              href="mailto:hello@sakollife.com"
              className="bg-secondary-foreground/10 dark:bg-white/10 hover:bg-secondary-foreground/20 dark:hover:bg-white/20 transition-colors duration-200 rounded-lg p-2"
              aria-label="Email"
            >
              <Mail className="w-4 h-4 text-secondary-foreground dark:text-white" />
            </a>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-secondary-foreground/40 dark:text-white/40">
              Partner Universities
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {/* RUPP */}
              <div className="relative overflow-hidden">
                <Image
                  src="/images/RUPP_logo.png"
                  alt="RUPP logo"
                  width={36}
                  height={36}
                />
                <div className="absolute inset-0 dark:bg-black/20 rounded-full" />
              </div>
              {/* ITC */}
              <div className="relative overflow-hidden">
                <Image
                  src="/images/itc_logo.png"
                  alt="ITC logo"
                  width={40}
                  height={40}
                />
                <div className="absolute inset-0 dark:bg-black/20 rounded-full" />
              </div>
              {/* NUM */}
              <div className="relative overflow-hidden">
                <Image
                  src="/images/num_logo1.png"
                  alt="NUM logo"
                  width={40}
                  height={40}
                />
                <div className="absolute inset-0 dark:bg-black/20 rounded-full" />
              </div>
              {/* Paragon — light mode */}
              <div className="relative overflow-hidden dark:hidden">
                <Image
                  src="/images/piu_logo.png"
                  alt="Paragon IU logo"
                  width={80}
                  height={50}
                />
              </div>
              {/* Paragon — dark mode */}
              <div className="relative overflow-hidden hidden dark:flex">
                <Image
                  src="/images/piu_darkmode_logo.png"
                  alt="Paragon IU logo"
                  width={80}
                  height={50}
                />
                <div className="absolute inset-0 dark:bg-black/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-foreground/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-xs text-secondary-foreground/40 dark:text-white/40">
            © Sakol Life. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}