import { ArrowUpRight, Github } from "lucide-react";

const evidence = [
  {
    image: "/assets/avatar-case-study/interface.jpg",
    width: 1280,
    height: 720,
    title: "The working interface",
    alt: "Live portfolio showing the 3D avatar beside its conversation entry point",
    caption: "A desktop capture of the deployed portfolio. React Three Fiber renders the avatar while the surrounding React interface provides navigation and the conversation entry point.",
  },
  {
    image: "/assets/avatar-case-study/conversation.jpg",
    width: 620,
    height: 520,
    title: "A real conversation",
    alt: "The avatar answering a real question about Neeraj's expected graduation",
    caption: "A real response captured from the public site, not a mockup. The question asks when I graduate; the answer draws on the current education details bundled with the server.",
  },
  {
    image: "/assets/avatar-case-study/request-flow.svg",
    width: 1000,
    height: 720,
    title: "From question to mouth movement",
    alt: "Six-step diagram tracing visitor input through Express, Gemini, speech synthesis, browser playback, and mouth animation",
    caption: "An implementation diagram derived from this repository. It traces the server's model and speech requests, then the browser's audio-energy analysis and playback-synchronized mouth animation.",
  },
];

export default function AvatarCaseStudy() {
  return (
    <article id="avatar-case-study" className="max-w-6xl mx-auto mt-20 border-t border-border pt-12 scroll-mt-24" aria-labelledby="avatar-case-study-title">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-primary mb-2">Project Case Study</p>
          <h3 id="avatar-case-study-title" className="text-2xl md:text-3xl font-bold">AI Conversational Avatar</h3>
        </div>
        <a href="https://github.com/Neeraj0704/Portfolio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
          <Github className="w-4 h-4" aria-hidden="true" /> Source code <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-sm text-muted-foreground leading-relaxed">
        <section aria-labelledby="avatar-objective">
          <h4 id="avatar-objective" className="text-lg font-semibold text-foreground mb-3">Objective</h4>
          <p>Make a portfolio conversational: visitors can ask about my experience, projects, and skills instead of only reading a resume. The project combines a React interface, a 3D avatar, and a server that generates short answers from my professional background.</p>
        </section>
        <section aria-labelledby="avatar-implementation">
          <h4 id="avatar-implementation" className="text-lg font-semibold text-foreground mb-3">Implementation</h4>
          <p>Express validates each question and supplies current resume facts to Gemini. Google Text-to-Speech produces the reply audio. In the browser, audio energy is measured in 20 ms frames and sampled at the playback position to drive the avatar's mouthOpen morph target.</p>
        </section>
        <section aria-labelledby="avatar-results">
          <h4 id="avatar-results" className="text-lg font-semibold text-foreground mb-3">Challenges &amp; Results</h4>
          <p>Slow retrieval and unavailable AI services could delay conversations. Bundled resume context removes the older vector lookup, while deadlines and a model fallback bound provider waits. Text remains available when speech fails. Automated tests cover response handling, speech timing, silence, and resume downloads; provider latency still varies.</p>
        </section>
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-8" data-testid="avatar-project-evidence">
        {evidence.map((item, index) => (
          <figure key={item.image} className="min-w-0">
            <a href={item.image} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size visual: ${item.title}`} title={`Open full-size visual: ${item.title}`} className="block border border-border rounded-lg overflow-hidden bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <img src={item.image} alt={item.alt} width={item.width} height={item.height} loading="lazy" className="w-full aspect-[4/3] object-contain" />
            </a>
            <figcaption className="mt-4 text-sm text-muted-foreground leading-relaxed">
              <span className="block text-base font-semibold text-foreground mb-2">{index + 1}. {item.title}</span>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Screenshots captured October 25, 2026. Diagram documents the implemented request flow, not a performance benchmark.</p>
    </article>
  );
}
