import { Code, Brain, Database } from "lucide-react";

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <Code className="text-primary" />,
      skills: ["C", "Java", "C#", "Python", "HTML", "CSS", "JavaScript", "ReactJS", "NodeJS"],
      colorClass: "bg-primary/20 text-primary",
    },
    {
      title: "AI & Machine Learning",
      icon: <Brain className="text-green-400" />,
      skills: ["Deep Learning", "TensorFlow", "OpenCV", "YOLOv5", "CNN", "Apache OpenNLP"],
      colorClass: "bg-green-500/20 text-green-400",
    },
    {
      title: "Tools & Databases",
      icon: <Database className="text-purple-400" />,
      skills: ["Unity2D & 3D", "Google Maps API", "DBMS", "SQL", "SQLite", "Jira"],
      colorClass: "bg-purple-500/20 text-purple-400",
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