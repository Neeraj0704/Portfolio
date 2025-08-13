import { Button } from "@/components/ui/button";
import { Linkedin, Github, Mail, UserIcon } from "lucide-react";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold">
                Hi, I'm <span className="text-primary">Neeraj</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Software Engineer and AI Enthusiast
              </p>
              <p className="text-lg text-muted leading-relaxed max-w-lg">
                Passionate about creating intelligent solutions through cutting-edge technology. 
                I specialize in full-stack development, machine learning, and building immersive 3D experiences.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => scrollToSection("projects")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-view-work"
              >
                View My Work
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection("contact")}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                data-testid="button-contact"
              >
                Get In Touch
              </Button>
            </div>
            
            <div className="flex space-x-6 text-2xl">
              <a
                href="https://linkedin.com/in/neerajvpattanashetti"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors"
                data-testid="link-linkedin"
              >
                <Linkedin />
              </a>
              <a
                href="https://github.com/neerajvpattanashetti"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors"
                data-testid="link-github"
              >
                <Github />
              </a>
              <a
                href="mailto:neerajvpattanashetti@gmail.com"
                className="text-muted hover:text-primary transition-colors"
                data-testid="link-email"
              >
                <Mail />
              </a>
            </div>
          </div>
          
          {/* Profile Image Section */}
          <div className="canvas-container animate-slide-in">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-green-500/20 rounded-lg">
              <div className="text-center space-y-4">
                <div className="w-64 h-64 mx-auto bg-primary/20 rounded-full flex items-center justify-center overflow-hidden border-4 border-primary/30">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
                    alt="Neeraj V Pattanashetti"
                    className="w-full h-full object-cover"
                    data-testid="img-hero-profile"
                  />
                </div>
                <p className="text-muted-foreground">Software Engineer & AI Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
