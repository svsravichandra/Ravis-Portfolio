import { motion } from "framer-motion";

const strengthTiles = [
  {
    icon: "fas fa-code",
    title: "Front-End Engineering",
    description: "Crafting pixel-perfect, responsive interfaces",
  },
  {
    icon: "fas fa-robot",
    title: "AI & Agentic Systems",
    description: "Building intelligent, autonomous solutions",
  },
  {
    icon: "fas fa-lightbulb",
    title: "Product Innovation",
    description: "Turning bold ideas into innovative products",
  },
  {
    icon: "fas fa-sitemap",
    title: "Software Architecture",
    description: "Building solid foundations for grand ideas",
  },
];

export default function CoreStrengths() {
  return (
    <section
      id="strengths"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 py-20 sm:py-16 lg:py-0 section-snap"
    >
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          className="mb-12 sm:mb-14 lg:mb-16 sm:text-left text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-space text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Core <span className="text-primary">Competencies</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-400 mb-6 sm:mb-8 italic">
            Excellence isn't just what I do – it's how I think.
          </p>

          {/* Motivational Quote */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border-l-4 border-secondary max-w-3xl">
            <blockquote className="text-sm sm:text-base lg:text-lg italic text-gray-300">
              "Excellence is not a skill, it's an attitude."
            </blockquote>
            <cite className="text-secondary font-semibold mt-2 block text-sm sm:text-base">
              – Ralph Marston
            </cite>
          </div>
        </motion.div>

        {/* Strength Tiles */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {strengthTiles.map((tile, index) => (
            <motion.div
              key={index}
              className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 tile-hover transition-all duration-500 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, rotate: 1 }}
            >
              <div className="text-primary text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">
                <i className={tile.icon}></i>
              </div>
              <h3 className="font-space text-base sm:text-lg lg:text-xl xl:text-2xl font-bold mb-2 sm:mb-3">
                {tile.title}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">{tile.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
