"use client";
import { cormorantRegular, latoRegular } from "@/fonts";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const MainInfoCard = (): React.JSX.Element => {
  return (
    <AnimatePresence>
      <div className="grid sm:w-2/3 p-5 sm:p-0 sm:grid-cols-5 bg-themeWhite rounded-3xl overflow-hidden shadow-lg">
        <div className="hidden sm:block sm:col-span-2 bg-[url('/images/home-demo.png')]"></div>
        <div className="sm:col-span-3 bg-themeWhite">
          <div className="sm:m-11">
            <motion.h1
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="text-textPrimary font-island-moments text-4xl sm:text-6xl"
            >
              About us
            </motion.h1>
            <motion.h2
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={twMerge(
                cormorantRegular.className,
                "text-textPrimary text-4xl sm:text-6xl"
              )}
            >
              Handicraft
            </motion.h2>
            <motion.p
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className={twMerge(
                latoRegular.className,
                "text-textPrimary mt-6 text-wrap"
              )}
            >
              Lorem ipsum dolor sit amet consectetur. Tempor faucibus sit
              iaculis arcu felis. Volutpat sollicitudin tortor aliquam maecenas
              porttitor ac et blandit. Pretium urna at ac purus aliquet mauris.
              Sit feugiat mattis turpis congue justo.
            </motion.p>
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="w-full flex flex-row justify-between mt-10"
            >
              <NumberItem keyw="products" value="123.5k+" />
              <NumberItem keyw="years experience" value="20" />
              <NumberItem keyw="user returned" value="97%" />
            </motion.div>
            <Link
              className="text-textSecondary flex flex-row items-center mt-10"
              href={"#"}
              title="Readmore"
            >
              <div
                style={{ height: 1 }}
                className="bg-textSecondary w-10 mr-1"
              ></div>
              <p className={twMerge(latoRegular.className, "text-base")}>
                READ MORE
              </p>
            </Link>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

const NumberItem = ({ keyw, value }: { keyw: string; value: string }) => {
  return (
    <div>
      <p
        className={twMerge(
          cormorantRegular.className,
          "text-textPrimary text-4xl sm:text-5xl"
        )}
      >
        {value}
      </p>
      <p
        className={twMerge(
          latoRegular.className,
          "text-textSecondary text-base mt-2"
        )}
      >
        {keyw}
      </p>
    </div>
  );
};
