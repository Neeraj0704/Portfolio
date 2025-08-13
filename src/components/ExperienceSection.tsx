import { Code, Check } from "lucide-react";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              My <span className="text-primary">Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground">Professional journey and key accomplishments</p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-primary/30"></div>
            
            <div className="space-y-12">
              {/* Experience Item */}
              <div className="relative flex items-start space-x-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary/30">
                  <Code className="text-primary text-xl" />
                </div>
                
                <div className="flex-1 glass-morphism p-8 rounded-xl" data-testid="card-experience-kreedloka">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground" data-testid="text-job-title">Software Engineer Intern</h3>
                      <p className="text-primary font-medium" data-testid="text-company">KreedaLoka</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground" data-testid="text-dates">Jul 2023 - Dec 2023</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-location">Bengaluru, India</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-muted leading-relaxed" data-testid="text-description">
                      Developed ChessEra, a comprehensive chess application used by chess academies to enhance student skills and host tournaments.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Check className="text-primary mt-1 h-4 w-4" />
                        <p className="text-muted" data-testid="text-achievement-1">Integrated Arena mode using Java (SERVER), C#, and Unity2D (CLIENT)</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="text-primary mt-1 h-4 w-4" />
                        <p className="text-muted" data-testid="text-achievement-2">Enhanced user engagement and significantly increased the user base</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Java</span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">C#</span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Unity2D</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}