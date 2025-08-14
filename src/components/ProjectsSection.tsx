import { Github, ExternalLink } from "lucide-react";

export default function ProjectsSection() {
  const projects = [
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
      id: "hospital-connect",
      title: "Hospital Connect",
      date: "Oct 2024",
      description:
        "React.js-based healthcare platform enabling users to locate nearby hospitals, access real-time resource availability and virtual consultations with Google Maps APIs integration.",
      image: "/download.webp",
      technologies: ["React.js", "Google Maps API", "Firebase", "Real-time Chat"],
      github: "", // remove GitHub icon
      demo: "https://www.youtube.com/watch?v=FhRxT80_ZGg",
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
    {
      id: "panic-shield",
      title: "Panic Shield",
      date: "Oct 2023",
      description:
        "Smartwatch app developed using Python and Swift with 91% accuracy in AI model. Detects panic attacks and provides timely support for user well-being and security.",
      image:
        "https://images.unsplash.com/photo-1544117519-31a4b719223d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      technologies: ["Python", "Swift", "NumPy", "SKLearn"],
      github: "", // remove GitHub icon
      demo: "https://devpost.com/software/panicshield",
    },
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
                <div className="flex items-center justify-between">
                  <h3
                    className="text-xl font-bold text-foreground"
                    data-testid={`text-project-title-${project.id}`}
                  >
                    {project.title}
                  </h3>
                  <span
                    className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full"
                    data-testid={`text-project-date-${project.id}`}
                  >
                    {project.date}
                  </span>
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
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-foreground transition-colors"
                      data-testid={`link-github-${project.id}`}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-foreground transition-colors"
                      data-testid={`link-demo-${project.id}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
