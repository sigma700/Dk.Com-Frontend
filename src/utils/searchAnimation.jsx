import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Search, X} from "lucide-react";

export const AppleSearchAnimation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const suggestions = ["Herbal Soap"];

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <motion.button
        onClick={handleOpen}
        whileHover={{scale: 1.09}}
        whileTap={{scale: 0.95}}
        className="p-2 rounded-full hover:bg-white/10 transition-colors hover:cursor-pointer active:cursor-pointer"
      >
        <Search className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-6"
            onClick={handleClose}
          >
            <motion.div
              initial={{y: -50, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              exit={{y: -30, opacity: 0}}
              transition={{type: "spring", stiffness: 300, damping: 30}}
              className="max-w-3xl w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="flex items-center bg-black/40 backdrop-blur-xl rounded-3xl px-8 py-5 border border-white/20 shadow-2xl focus-within:border-white/40 transition-all">
                  <Search className="w-7 h-7 text-white/60 mr-4" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Quick Search"
                    className="flex-1 bg-transparent outline-none text-2xl text-white placeholder-white/40"
                    autoFocus
                  />
                  <motion.button
                    onClick={handleClose}
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    className="ml-4 p-2 rounded-full hover:bg-white/20"
                  >
                    <X className="w-6 h-6 text-white/60" />
                  </motion.button>
                </div>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent mt-1 mx-auto w-3/4" />
              </div>

              <div className="mt-12">
                <p className="text-black font-extrabold text-sm tracking-widest mb-6 px-4">
                  POPULAR SEARCHES
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion}
                      initial={{opacity: 0, x: -20}}
                      animate={{opacity: 1, x: 0}}
                      transition={{delay: 0.05 * index}}
                      whileHover={{
                        x: 10,
                        backgroundColor: "rgba(0,0,0,0.4)",
                      }}
                      className="flex items-center px-8 py-5 text-xl rounded-2xl hover:bg-black/40 cursor-pointer group backdrop-blur-sm bg-black/20 border border-white/10"
                      onClick={() => {
                        setQuery(suggestion);
                        console.log("Searching for:", suggestion);
                      }}
                    >
                      <Search className="w-5 h-5 mr-6 text-white/40 group-hover:text-white transition-colors" />
                      <span className="text-white/80 group-hover:text-white">
                        {suggestion}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-16 text-center text-white/40 text-sm">
                Press{" "}
                <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  ESC
                </span>{" "}
                to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
