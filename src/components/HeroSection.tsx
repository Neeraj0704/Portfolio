import { Button } from "@/components/ui/button";
import { Linkedin, Github, Mail } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import { Text } from "@react-three/drei";
//import FloatingCard from "./ui/floatingCard";

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
          {/* LEFT TEXT SECTION */}
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
              >
                View My Work
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection("contact")}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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
              >
                <Linkedin />
              </a>
              <a
                href="https://github.com/neerajvpattanashetti"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors"
              >
                <Github />
              </a>
              <a
                href="mailto:neerajvpattanashetti@gmail.com"
                className="text-muted hover:text-primary transition-colors"
              >
                <Mail />
              </a>
            </div>
          </div>

          {/* RIGHT SIDE — AVATAR + AI Clone Text */}
          <div className="canvas-container animate-slide-in w-full h-[400px] lg:h-[500px]">
            <Canvas shadows camera={{ position: [0, 0, 8], fov: 50 }}>
              <Experience />
            </Canvas>
          </div>
        
        </div>
      </div>
    </section>
  );
}
