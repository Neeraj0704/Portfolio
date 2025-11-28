import { Code, Brain, Database, Cloud, Server, FileText, Wrench } from "lucide-react";

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <Code className="text-primary" />,
      skills: [
        "Python",
        "Java",
        "C++",
        "C#",
        "TypeScript",
        "JavaScript",
        "Swift (basic)",
      ],
      colorClass: "bg-primary/20 text-primary",
    },
    {
      title: "Frameworks",
      icon: <Server className="text-sky-400" />,
      skills: ["Node.js", "Express", "React.js", "TensorFlow", "PyTorch"],
      colorClass: "bg-sky-500/20 text-sky-400",
    },
    {
      title: "Systems & Cloud",
      icon: <Cloud className="text-cyan-400" />,
      skills: [
        "AWS",
        "Firebase",
        "CI/CD",
        "Docker",
        "Microservices",
        "Distributed Systems",
      ],
      colorClass: "bg-cyan-500/20 text-cyan-400",
    },
    {
      title: "AI / Machine Learning",
      icon: <Brain className="text-green-400" />,
      skills: [
        "Large Language Models (LLMs)",
        "Conversational AI",
        "LangChain",
        "API",
        "Reinforcement Learning",
        "Ray",
        "Deep Learning",
      ],
      colorClass: "bg-green-500/20 text-green-400",
    },
    {
      title: "Databases",
      icon: <Database className="text-purple-400" />,
      skills: ["SQL", "NoSQL (Firebase Realtime DB)", "Data Modelling"],
      colorClass: "bg-purple-500/20 text-purple-400",
    },
    {
      title: "Communication",
      icon: <FileText className="text-amber-400" />,
      skills: [
        "Technical Documentation",
        "Research Writing",
        "Cross-functional Collaboration",
      ],
      colorClass: "bg-amber-500/20 text-amber-400",
    },
    {
      title: "Tools / Other",
      icon: <Wrench className="text-rose-400" />,
      skills: [
        "Agile",
        "Jira",
        "Debugging",
        "Version Control",
        "Testing Automation",
        "Docker",
        "Unity 2D/3D",
      ],
      colorClass: "bg-rose-500/20 text-rose-400",
    },
  ];

  return (
    <section id="skills" className="py-16 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Technical <span className="text-primary">Skills</span>
            </h2>
            <p className="text-lg text-muted-foreground">Technologies and tools I work with</p>
          </div>
          
          <div className="space-y-8">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="glass-morphism p-6 rounded-xl"
                data-testid={`section-skills-${categoryIndex}`}
              >
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  {category.icon}
                  <span className="ml-3" data-testid={`text-skill-category-${categoryIndex}`}>
                    {category.title}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className={`skill-badge px-3 py-1 ${category.colorClass} rounded-lg font-medium text-sm`}
                      data-testid={`badge-skill-${categoryIndex}-${skillIndex}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}