import { Code, Check, BookOpen } from "lucide-react";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              My <span className="text-primary">Experience</span> and <span className="text-primary">Publications</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional journey and key accomplishments
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-primary/30"></div>

            <div className="space-y-12">
              <div className="relative flex items-start gap-3 sm:gap-8">
                <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary/30">
                  <Code className="text-primary" />
                </div>
                <div className="min-w-0 flex-1 glass-morphism p-4 sm:p-8 rounded-xl" data-testid="card-experience-sap">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">AI Scientist Intern</h3>
                      <p className="text-primary font-medium">SAP Labs</p>
                    </div>
                    <div className="md:text-right text-muted-foreground">
                      <p>May 2026 - Present</p>
                      <p className="text-sm">Palo Alto, USA</p>
                    </div>
                  </div>
                  <ul className="list-disc pl-5 space-y-3 text-muted leading-relaxed">
                    <li>Built an enterprise AI-agent evaluation system with a structured rubric-generation pipeline spanning intent analysis, fact classification, and critic-based validation.</li>
                    <li>Used evaluation results to refine agent behavior and skills across retrieval, lookup, filtering, conditional, and time-sensitive tasks.</li>
                    <li>Analyzed agent traces, tool calls, generated requests, and execution paths to distinguish agent failures from evaluation-system failures.</li>
                    <li>Resolved per-request user-context and metadata-propagation issues that caused authentication and execution failures.</li>
                    <li>Designed LLM-judge evaluation strategies for large JSON inputs using compact profiling, context control, and structured preprocessing.</li>
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {["Agent Evaluation", "LLM Judges", "Trace Analysis", "Agent Optimization"].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Experience Card */}
              <div className="relative flex items-start gap-3 sm:gap-8">
                <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary/30">
                  <Code className="text-primary text-xl" />
                </div>

                <div
                  className="min-w-0 flex-1 glass-morphism p-4 sm:p-8 rounded-xl"
                  data-testid="card-experience-kreedloka"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3
                        className="text-2xl font-bold text-foreground"
                        data-testid="text-job-title"
                      >
                        Software Engineering Intern
                      </h3>
                      <p
                        className="text-primary font-medium"
                        data-testid="text-company"
                      >
                        KreedaLoka
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p
                        className="text-muted-foreground"
                        data-testid="text-dates"
                      >
                        Jul 2023 - Dec 2023
                      </p>
                      <p
                        className="text-sm text-muted-foreground"
                        data-testid="text-location"
                      >
                        Bengaluru, India
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p
                      className="text-muted leading-relaxed"
                      data-testid="text-description"
                    >
                      Developed ChessEra, a comprehensive chess application used
                      by chess academies to enhance student skills and host
                      tournaments.
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Check className="text-primary mt-1 h-4 w-4" />
                        <p
                          className="text-muted"
                          data-testid="text-achievement-1"
                        >
                          Engineered real-time backend systems with Java, C#/.NET,
                          and WebSockets, supporting 100+ concurrent users with
                          low-latency state synchronization and gameplay updates.
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="text-primary mt-1 h-4 w-4" />
                        <p
                          className="text-muted"
                          data-testid="text-achievement-2"
                        >
                          Optimized relational schemas, SQL queries, and tournament-matching
                          workflows, reducing retrieval latency by 40% under concurrent load.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        Java
                      </span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        C#
                      </span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        WebSockets / SQL
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Publications Card */}
              <div className="relative flex items-start gap-3 sm:gap-8">
                <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary/30">
                  <BookOpen className="text-primary text-xl" />
                </div>

                <div className="min-w-0 flex-1 glass-morphism p-4 sm:p-8 rounded-xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        Publications
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-muted">
                        <strong>Enhancing Early Detection of Pancreatic Cancer</strong> – First author.
                        Used machine learning and explainable AI to improve early
                        detection. Presented at the IEEE CVMI Conference, IIIT
                        Allahabad (Oct 2024).
                        <a
        href="https://ieeexplore.ieee.org/document/10781815"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 inline-block px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/80 transition-colors"
      >
        View Paper
      </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">
                        <strong>Heart Attack Prediction using Ensemble Models</strong> – Co-author.
                        Applied ensemble methods and advanced tuning with LIME
                        and SHAP for better prediction accuracy. Presented at the
                        IEEE 4th Mysore Sub Section International Conference (Aug
                        2024).
                      </p>
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
