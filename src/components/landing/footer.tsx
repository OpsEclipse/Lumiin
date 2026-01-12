import Link from "next/link";
import { XLogo, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  product: [
    { label: "Download", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "Pricing", href: "#pricing" },
    { label: "Methodology", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Legal", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export function Footer(): React.ReactElement {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                L
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Lumiin
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              San Francisco, CA
              <br />
              Designed for the future of work.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="uppercase tracking-widest text-sm text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    className="hover:text-primary transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="uppercase tracking-widest text-sm text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    className="hover:text-primary transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="uppercase tracking-widest text-sm text-foreground mb-4">Social</h4>
            <div className="flex space-x-4">
              <a
                className="text-muted-foreground hover:text-primary transition-colors"
                href="#"
                aria-label="X (Twitter)"
              >
                <XLogo size={24} weight="regular" />
              </a>
              <a
                className="text-muted-foreground hover:text-primary transition-colors"
                href="#"
                aria-label="GitHub"
              >
                <GithubLogo size={24} weight="regular" />
              </a>
              <a
                className="text-muted-foreground hover:text-primary transition-colors"
                href="#"
                aria-label="LinkedIn"
              >
                <LinkedinLogo size={24} weight="regular" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <Separator className="mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© 2024 Lumiin Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a className="hover:text-foreground transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-foreground transition-colors" href="#">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
