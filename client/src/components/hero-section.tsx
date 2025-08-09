import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import portraitImage from "@assets/ChatGPT Image Aug 8, 2025, 04_52_14 AM_1754660498096.png";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-6 lg:px-12 section-snap"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Portrait - Mobile First */}
          <motion.div
            className="portrait-container flex justify-center lg:justify-end order-1 lg:order-2"
            id="portrait-hero"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96">
                <img
                  src={portraitImage}
                  alt="Satya Ravi - Professional Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Left Content */}
          <motion.div
            className="space-y-8 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-space text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Hey,
              <br />
              I'm <span className="text-primary">Satya Ravi</span>
            </h1>
            <div className="space-y-2">
              <h2 className="font-space text-2xl lg:text-3xl xl:text-4xl font-light text-gray-300 relative">
                <span className="relative italic">
                  I'm just a Developer.
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 400 40"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5,20 Q80,15 160,22 T320,18 T395,20 M8,18 Q100,24 200,17 T390,22"
                      stroke="rgb(239 68 68)"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.85"
                      className="scribble-path"
                    />
                  </svg>
                </span>
              </h2>
              <div
                className="handwritten-text text-2xl lg:text-3xl xl:text-4xl"
                style={{ color: "rgb(239 68 68)" }}
              >
                I Craft Innovations
              </div>
            </div>
            <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-2xl">
              Building intelligent applications with{" "}
              <span className="text-primary font-semibold">scale</span>,
              <span className="text-primary font-semibold"> creativity</span>,
              and
              <span className="text-primary font-semibold"> impact.</span>
            </p>

            {/* Motivational Quote */}
            <div className="glass rounded-2xl p-6 border-l-4 border-primary max-w-2xl">
              <blockquote className="text-lg italic text-gray-300">
                "The best way to predict the future is to invent it."
              </blockquote>
              <cite className="text-primary font-semibold mt-2 block">
                – Alan Kay
              </cite>
            </div>

            <div className="flex space-x-4">
              <Button className="bg-primary text-dark px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 btn-glow">
                Let's Connect
              </Button>
              <Button
                variant="outline"
                className="glass px-8 py-4 rounded-xl font-semibold hover:bg-opacity-20 transition-all duration-300"
              >
                View Work
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
