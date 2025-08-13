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
  <div className="w-70 h-70 overflow-hidden border-4 border-primary/20 rounded-lg shadow-lg">
    <img
      src="/1752865321131.jpeg"
      alt="Professional headshot"
      className="w-full h-full object-cover"
      data-testid="img-profile"
    />
  </div>
</div>
            
            <div className="md:col-span-2 space-y-6">
              <p className="text-lg text-muted leading-relaxed" data-testid="text-bio">
                I'm a passionate Software Engineer and AI enthusiast currently pursuing my Master's in Computer Science 
                at the University of Illinois Chicago. With experience in full-stack development, machine learning, 
                and 3D graphics, I love building innovative solutions that bridge technology and user experience.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-primary font-semibold mb-2">Education</h3>
                  <p className="text-foreground" data-testid="text-education-degree">MS Computer Science</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-education-school">University of Illinois Chicago</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-education-dates">2025 - 2027</p>
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