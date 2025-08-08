import { motion } from "framer-motion";

const strengthTiles = [
  {
    icon: "fas fa-code",
    title: "Front-End Engineering",
    description: "Crafting pixel-perfect, responsive interfaces"
  },
  {
    icon: "fas fa-robot",
    title: "AI & Agentic Systems",
    description: "Building intelligent, autonomous solutions"
  },
  {
    icon: "fas fa-lightbulb",
    title: "Product Innovation",
    description: "Turning bold ideas into innovative products"
  },
  {
    icon: "fas fa-sitemap",
    title: "Software Architecture",
    description: "Building solid foundations for grand ideas"
  }
];

export default function CoreStrengths() {
  return (
    <section id="strengths" className="min-h-screen flex items-center justify-center px-6 lg:px-12">
      <div className="max-w-7xl mx-auto w-full text-center">
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-space text-3xl lg:text-5xl font-bold mb-6">
            Core <span className="text-primary">Strengths</span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-400 mb-8 italic">
            Excellence isn't just what I do – it's how I think.
          </p>
          
          {/* Motivational Quote */}
          <div className="glass rounded-2xl p-6 border-l-4 border-secondary max-w-3xl mx-auto">
            <blockquote className="text-lg italic text-gray-300">
              "Excellence is not a skill, it's an attitude."
            </blockquote>
            <cite className="text-secondary font-semibold mt-2 block">– Ralph Marston</cite>
          </div>
        </motion.div>

        {/* Strength Tiles */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {strengthTiles.map((tile, index) => (
            <motion.div
              key={index}
              className="glass-strong rounded-3xl p-8 tile-hover transition-all duration-500 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, rotate: 1 }}
            >
              <div className="text-primary text-4xl mb-4">
                <i className={tile.icon}></i>
              </div>
              <h3 className="font-space text-xl lg:text-2xl font-bold mb-3">{tile.title}</h3>
              <p className="text-gray-400">{tile.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
