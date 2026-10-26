import { Github, ExternalLink, BookOpen } from "lucide-react";
import AvatarCaseStudy from "./AvatarCaseStudy";

export default function ProjectsSection() {
  const projects = [
    {
      id: "salesforce-metadata-impact",
      title: "Salesforce Metadata Impact Analysis",
      date: "Sep 2026",
      description:
        "Developed a backend prototype for Salesforce metadata impact analysis using FastAPI, Neo4j, OAuth, and isolated Docker sessions. The public version retrieves and parses metadata, traces dependencies, and explains risk for a specified component change. Conversational AI, automatic change detection, and a web application remain on its roadmap.",
      image: "/assets/salesforce-metadata-impact.svg",
      technologies: ["Salesforce Metadata API", "Neo4j", "FastAPI", "Docker", "OAuth"],
      github: "https://github.com/Neeraj0704/Salesforce-Metadata-Impact-Analysis-System-v2",
      demo: "",
    },
    {
      id: "agent-orchestration",
      title: "Autonomous Agent Orchestration Platform",
      date: "Jan 2026",
      description:
        "Architected a supervision platform for autonomous AI voice agents using locally hosted LLMs through Ollama and an MCP control plane. Integrated telephony, transcription, RAG, and telemetry for call outcomes, summaries, latency, and cost, enabling human-in-the-loop analysis and iterative agent evaluation.",
      image: "https://i.ytimg.com/vi/HgFAyStXSSI/hqdefault.jpg",
      technologies: ["Ollama", "MCP", "RAG", "Voice Agents", "Agent Evaluation"],
      github: "",
      demo: "https://www.youtube.com/watch?v=HgFAyStXSSI",
    },
    {
      id: "ai-avatar",
      title: "AI Conversational Avatar",
      date: "Aug 2025",
      description:
        "Developed a Gemini-powered 3D portfolio avatar with voice-enabled interactions and audio-driven lip sync. Originally built with Pinecone retrieval, the current version uses bundled resume context to keep answers current without a remote retrieval delay.",
      image:
        "/assets/avatar-case-study/interface.jpg",
      technologies: ["Gemini", "React Three Fiber", "Resume Context", "TTS/STT"],
      github: "https://github.com/Neeraj0704/Portfolio",
      demo: "#home",
    },
    {
      id: "fixmyiot",
      title: "FixMyIot",
      date: "Jan 2025",
      description:
        "AI-powered IoT troubleshooting platform built with React.js, Node.js, and Express. Users can upload hardware images and receive step-by-step solutions via OpenAI GPT-4o integration.",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      technologies: ["React.js", "Node.js", "OpenAI GPT-4o", "Tailwind CSS"],
      github: "https://github.com/Neeraj0704/FixMyIOT",
      demo: "", // remove demo icon
    },
    {
      id: "facial-recognition",
      title: "Facial & Gesture Recognition",
      date: "Jul 2024",
      description:
        "Comprehensive system for identifying facial expressions and sign language motions using Deep Learning Frameworks, YOLOv5, EfficientNet, OpenCV, and TensorFlow/Keras.",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      technologies: ["YOLOv5", "EfficientNet", "OpenCV", "TensorFlow"],
      github: "https://github.com/Neeraj0704/Facial-and-Gesture-recognition-for-Sign-Language",
      demo: "", // remove demo icon
    },
    // panic-shield removed per request
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my latest work in AI, web development, and innovative solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card glass-morphism p-6 rounded-xl"
              data-testid={`card-project-${project.id}`}
            >
              <div className="mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-40 object-cover rounded-lg"
                  data-testid={`img-project-${project.id}`}
                />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3
                    className="text-xl font-bold text-foreground"
                    data-testid={`text-project-title-${project.id}`}
                  >
                    {project.title}
                  </h3>
                  {project.date && <span
                    className="shrink-0 text-xs text-primary bg-primary/20 px-2 py-1 rounded-full"
                    data-testid={`text-project-date-${project.id}`}
                  >
                    {project.date}
                  </span>}
                </div>

                <p
                  className="text-sm text-muted leading-relaxed"
                  data-testid={`text-project-description-${project.id}`}
                >
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs"
                      data-testid={`badge-tech-${project.id}-${index}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4 pt-2">
                  {project.id === "ai-avatar" && (
                    <a href="#avatar-case-study" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                      <BookOpen className="h-4 w-4" aria-hidden="true" /> Case study
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      aria-label={`View ${project.title} on GitHub`}
                      title={`View ${project.title} on GitHub`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-foreground transition-colors"
                      data-testid={`link-github-${project.id}`}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {project.demo && (
                    project.demo.startsWith("#") ? (
                      <a
                        href={project.demo}
                        aria-label={`Try ${project.title}`}
                        title={`Try ${project.title}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.querySelector(project.demo);
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="text-primary hover:text-foreground transition-colors"
                        data-testid={`link-demo-${project.id}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <a
                        href={project.demo}
                        aria-label={`Watch ${project.title} demo`}
                        title={`Watch ${project.title} demo`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-foreground transition-colors"
                        data-testid={`link-demo-${project.id}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <AvatarCaseStudy />
      </div>
    </section>
  );
}
