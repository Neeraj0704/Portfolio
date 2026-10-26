export default function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-primary">Me</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex justify-center">
  <div className="w-60 aspect-square overflow-hidden border-4 border-primary/20 rounded-lg shadow-lg">
    <img
      src="/1752865321131.jpeg"
      alt="Neeraj smiling in a white shirt and black tie"
      className="w-full h-full object-cover object-top origin-top scale-[1.65]"
      data-testid="img-profile"
    />
  </div>
</div>
            
            <div className="md:col-span-2 space-y-6">
              <p className="text-lg text-muted leading-relaxed" data-testid="text-bio">
                I'm Neeraj Vijayakumar Pattanashetti, a Computer Science master's student at the University of Illinois at Chicago, with a 4.0 GPA and expected graduation in December 2026.
                As an AI Scientist Intern at SAP Labs, I build evaluation systems for enterprise AI agents and investigate the traces behind their failures.
                Previously, at KreedaLoka, I developed real-time backend systems supporting more than 100 concurrent users and reduced data-retrieval latency by 40%.
                My Salesforce Metadata Impact Analysis project explores component dependencies using Neo4j graphs and a FastAPI backend.
                I also built an autonomous voice-agent supervision platform using Ollama and MCP, with telemetry for human-in-the-loop evaluation.
                Across these projects, my work focuses on agent reliability, explainable workflows, and the backend systems that make them possible.
                After graduation, I want to work as an AI Scientist focused on agentic AI and LLMs, particularly agent orchestration and evaluation.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-primary font-semibold mb-2">Education</h3>
                  <p className="text-foreground" data-testid="text-education-degree">MS Computer Science</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-education-school">University of Illinois at Chicago</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-education-dates">Expected December 2026</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-education-gpa">GPA: 4.0 / 4.0</p>
                </div>
                <div>
                  <h3 className="text-primary font-semibold mb-2">Location</h3>
                  <p className="text-foreground" data-testid="text-location-city">Chicago, Illinois</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-location-country">United States</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
