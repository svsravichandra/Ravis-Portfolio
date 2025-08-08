import { useScrollObserver } from "@/hooks/use-scroll-observer";
import NavigationDots from "@/components/navigation-dots";
import HeroSection from "@/components/hero-section";
import CoreStrengths from "@/components/core-strengths";
import SkillSection from "@/components/skill-section";
import ChatbotSection from "@/components/chatbot-section";
import Footer from "@/components/footer";
import ParticleBackground from "@/components/particle-background";
import FloatingChatbot from "@/components/floating-chatbot";

const sectionIds = ['hero', 'strengths', 'frontend', 'ai', 'innovation', 'architecture', 'chatbot'];

export default function Portfolio() {
  const { activeSection, scrollToSection } = useScrollObserver(sectionIds);

  // Frontend Engineering Visual Component
  const FrontendVisual = () => (
    <div className="glass rounded-3xl p-6">
      <div className="text-primary text-6xl text-center mb-4">
        <i className="fab fa-react animate-spin" style={{ animationDuration: '10s' }}></i>
      </div>
      <h3 className="font-space text-xl font-bold text-center">Interactive UI</h3>
    </div>
  );

  // AI Systems Visual Component
  const AIVisual = () => (
    <div className="glass rounded-3xl p-8 text-center">
      <div className="text-primary text-6xl mb-4">
        <i className="fas fa-brain"></i>
      </div>
      <h3 className="font-space text-xl font-bold">Neural Networks</h3>
      <div className="mt-4 space-y-2">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '85%' }}></div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-secondary h-2 rounded-full animate-pulse" style={{ width: '92%' }}></div>
        </div>
      </div>
    </div>
  );

  // Innovation Visual Component
  const InnovationVisual = () => (
    <div className="glass rounded-3xl p-8 text-center">
      <div className="text-primary text-6xl mb-4 animate-pulse">
        <i className="fas fa-lightbulb"></i>
      </div>
      <h3 className="font-space text-xl font-bold mb-4">Creative Solutions</h3>
      <div className="space-y-2">
        <div className="w-full h-3 bg-gradient-to-r from-primary to-secondary rounded-full opacity-70"></div>
        <div className="w-3/4 h-3 bg-gradient-to-r from-secondary to-primary rounded-full opacity-50"></div>
        <div className="w-1/2 h-3 bg-gradient-to-r from-primary to-secondary rounded-full opacity-30"></div>
      </div>
    </div>
  );

  // Architecture Visual Component
  const ArchitectureVisual = () => (
    <div className="glass rounded-3xl p-8">
      <div className="text-primary text-6xl text-center mb-4">
        <i className="fas fa-sitemap"></i>
      </div>
      <h3 className="font-space text-xl font-bold text-center mb-4">System Design</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Scalability</span>
          <div className="w-20 h-2 bg-gray-700 rounded-full">
            <div className="w-full h-2 bg-primary rounded-full"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Security</span>
          <div className="w-20 h-2 bg-gray-700 rounded-full">
            <div className="w-4/5 h-2 bg-secondary rounded-full"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Performance</span>
          <div className="w-20 h-2 bg-gray-700 rounded-full">
            <div className="w-full h-2 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <ParticleBackground />
      <FloatingChatbot />
      <NavigationDots 
        activeSection={activeSection}
        totalSections={sectionIds.length}
        onSectionClick={scrollToSection}
      />

      <HeroSection />
      <CoreStrengths />
      
      <SkillSection
        id="frontend"
        title="Engineering"
        subtitle="Front-End"
        tagline="Where user experience meets technical mastery."
        description="Skilled at crafting pixel-perfect, responsive interfaces using HTML5, CSS3, and JavaScript/TypeScript. Proficient in React.js and Next.js for dynamic, single-page applications. Strong with Redux, Tailwind CSS, Material UI, and SASS/LESS. Focused on accessibility, performance, and cross-browser consistency; always optimizing for an interface that feels effortless and engaging."
        techStack={["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Material UI"]}
        quote="Design is not just what it looks like and feels like. Design is how it works."
        author="Steve Jobs"
        icon="fab fa-react"
        visualComponent={<FrontendVisual />}
      />

      <SkillSection
        id="ai"
        title="Systems"
        subtitle="AI & Agentic"
        tagline="Intelligence at the core of every solution."
        description="Skilled at leveraging artificial intelligence to create intuitive, proactive user experiences. Proficient with Python and JavaScript for AI prototyping, and focused on building agentic systems—autonomous digital agents, chatbots, and data-driven insights. Always exploring how neural networks, NLP, and automation can enhance user experience in responsible ways."
        techStack={["Python", "TensorFlow", "OpenAI API", "NLP", "Machine Learning"]}
        quote="AI is the new electricity."
        author="Andrew Ng"
        icon="fas fa-brain"
        reverse={true}
        visualComponent={<AIVisual />}
      />

      <SkillSection
        id="innovation"
        title="Innovation"
        subtitle="Product"
        tagline="Imagining what's next and making it real."
        description="Skilled at blending design thinking with emerging tech to turn bold ideas into innovative products. Adept at rapid prototyping, user-centered design, and translating trends into features that matter. Always iterating and improving, with a focus on solutions that are inventive yet intuitive."
        techStack={["Design Thinking", "Rapid Prototyping", "User Research", "MVP Development", "Agile Methodology"]}
        quote="Innovation distinguishes between a leader and a follower."
        author="Steve Jobs"
        icon="fas fa-lightbulb"
        visualComponent={<InnovationVisual />}
      />

      <SkillSection
        id="architecture"
        title="Architecture"
        subtitle="Product & Software"
        tagline="Building solid foundations for grand ideas."
        description="Skilled at designing scalable, secure, maintainable software systems and architectures—especially with AWS, Azure, REST APIs, Node.js, and .NET Core. Embrace DevOps principles (CI/CD, automated testing, monitoring), and balance elegance with pragmatism. Every structure is built for extensibility and future growth."
        techStack={["AWS", "Azure", "Node.js", ".NET Core", "REST APIs", "DevOps"]}
        quote="Whatever good things we build end up building us."
        author="Jim Rohn"
        icon="fas fa-sitemap"
        reverse={true}
        visualComponent={<ArchitectureVisual />}
      />

      <ChatbotSection />
      <Footer />
    </div>
  );
}
