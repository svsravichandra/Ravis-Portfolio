import { motion } from "framer-motion";

export default function Footer() {
  const socialLinks = [
    { icon: "fab fa-linkedin", href: "https://linkedin.com/in/satyaravi", label: "LinkedIn" },
    { icon: "fab fa-github", href: "https://github.com/satyaravi", label: "GitHub" },
    { icon: "fas fa-envelope", href: "mailto:contact@satyaravi.com", label: "Email" }
  ];

  return (
    <footer className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-12 border-t border-gray-800">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 sm:space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm sm:text-base text-gray-400">
              Designed and coded with vision by <span className="text-primary font-semibold">Venkata Satya Ravi , Sama</span>
            </p>
          </div>
          
          <div className="flex space-x-4 sm:space-x-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={link.label}
              >
                <i className={`${link.icon} text-xl sm:text-2xl`}></i>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
