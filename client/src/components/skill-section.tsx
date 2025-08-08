import { motion } from "framer-motion";

interface SkillSectionProps {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  techStack: string[];
  quote: string;
  author: string;
  icon: string;
  reverse?: boolean;
  visualComponent?: React.ReactNode;
}

export default function SkillSection({
  id,
  title,
  subtitle,
  tagline,
  description,
  techStack,
  quote,
  author,
  icon,
  reverse = false,
  visualComponent
}: SkillSectionProps) {
  const contentOrder = reverse ? "order-1 lg:order-2" : "lg:col-span-2";
  const visualOrder = reverse ? "order-2 lg:order-1" : "";

  return (
    <section id={id} className="min-h-screen flex items-center justify-center px-6 lg:px-12">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <motion.div 
            className={`${contentOrder} space-y-8`}
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="font-space text-3xl lg:text-5xl font-bold mb-4">
                {title.includes("span") ? (
                  <span dangerouslySetInnerHTML={{ __html: title }} />
                ) : (
                  <>
                    {subtitle} <span className="text-primary">{title}</span>
                  </>
                )}
              </h2>
              <p className="text-xl text-secondary font-medium italic mb-8">
                {tagline}
              </p>
            </div>

            <div className="glass rounded-3xl p-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-4">
              {techStack.map((tech, index) => (
                <span key={index} className="glass px-4 py-2 rounded-full text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>

            {/* Quote */}
            <div className="glass rounded-2xl p-6 border-l-4 border-primary">
              <blockquote className="text-lg italic text-gray-300">
                "{quote}"
              </blockquote>
              <cite className="text-primary font-semibold mt-2 block">– {author}</cite>
            </div>
          </motion.div>

          <motion.div 
            className={`portrait-container ${visualOrder}`}
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {visualComponent || (
              <div className="glass rounded-3xl p-6">
                <div className="text-primary text-6xl text-center mb-4">
                  <i className={icon}></i>
                </div>
                <h3 className="font-space text-xl font-bold text-center">{subtitle}</h3>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
