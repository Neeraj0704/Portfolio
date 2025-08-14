import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Linkedin, Github, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Get In <span className="text-primary">Touch</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I'm always open to discussing new opportunities, interesting
              projects, or just having a chat about technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div
                className="glass-morphism p-8 rounded-xl"
                data-testid="section-contact-info"
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Mail className="text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Email</p>
                      <p
                        className="text-muted-foreground"
                        data-testid="text-email"
                      >
                        neerajvpattanashetti@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Phone className="text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Phone</p>
                      <p
                        className="text-muted-foreground"
                        data-testid="text-phone"
                      >
                        +1 (312) 937-0261
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <MapPin className="text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Location</p>
                      <p
                        className="text-muted-foreground"
                        data-testid="text-location"
                      >
                        Chicago, Illinois
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/in/neeraj-vp-613305239/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  data-testid="link-social-linkedin"
                >
                  <Linkedin />
                </a>
                <a
                  href="https://github.com/Neeraj0704"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  data-testid="link-social-github"
                >
                  <Github />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="glass-morphism p-8 rounded-xl"
              data-testid="form-contact"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Send Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-foreground font-medium"
                  >
                    Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-2 bg-secondary/50 border-border text-black placeholder:text-muted-foreground focus:border-primary"
                    data-testid="input-name"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 bg-secondary/50 border-border text-black placeholder:text-muted-foreground focus:border-primary resize-none"
                    data-testid="input-email"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="subject"
                    className="text-foreground font-medium"
                  >
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Project Inquiry"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="mt-2 bg-secondary/50 border-border text-black placeholder:text-muted-foreground focus:border-primary resize-none"
                    data-testid="input-subject"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="text-foreground font-medium"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-2 bg-secondary/50 border-border text-black placeholder:text-muted-foreground focus:border-primary resize-none"
                    data-testid="textarea-message"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center space-x-2"
                  data-testid="button-submit"
                >
                  {loading ? "Sending..." : <span>Send Message</span>}
                  {!loading && <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
