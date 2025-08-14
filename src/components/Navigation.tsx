import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "experience", "projects", "skills", "contact"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = "/Server/src/Data/NEERAJ V PATTANASHETTI_RESUME.pdf";
    link.download = "Neeraj_V_Pattanashetti_Resume.pdf";
    link.click();
  };

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50 border-b border-border bg-background">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            data-testid="logo-button"
          >
            Neeraj V Pattanashetti
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`hover:text-primary transition-colors ${
                  activeSection === item.id ? "text-primary" : "text-foreground"
                }`}
                data-testid={`nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Resume + Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {/* Resume Button (Desktop) */}
            <Button
              variant="default"
              size="sm"
              onClick={downloadResume}
              className="hidden md:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="download-resume-button"
            >
              <Download className="h-4 w-4" />
              <span>Resume</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="mobile-menu-toggle"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4" data-testid="mobile-menu">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block hover:text-primary transition-colors ${
                  activeSection === item.id ? "text-primary" : "text-foreground"
                }`}
                data-testid={`mobile-nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
            {/* Resume Button (Mobile) */}
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                downloadResume();
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="mobile-download-resume-button"
            >
              <Download className="h-4 w-4" />
              <span>Download Resume</span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
