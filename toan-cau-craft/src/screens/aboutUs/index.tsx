import { TopBanner } from "@/components/TopBanner";
import {
  cormorantMedium,
  cormorantRegular,
  cormorantSemiBold,
  latoRegular,
  leagueSpartanMedium,
  leagueSpartanRegular,
} from "@/fonts";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export const AboutUs = (): React.JSX.Element => {
  return (
    <div>
      <TopBanner
        src="/images/about-us.png"
        h1="Handicraft"
        h2="MADE WITH LOVE"
        description="Lorem ipsum dolor sit amet consectetur. Tempor faucibus sit iaculis arcu felis. Volutpat sollicitudin tortor aliquam maecenas porttitor ac et blandit. Pretium urna at ac purus aliquet mauris. Sit feugiat mattis turpis congue justo."
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 m-5 md:m-20">
        <div className="hidden md:block md:col-span-1"></div>
        <div className="md:col-span-4">
          <p
            className={twMerge(
              cormorantSemiBold.className,
              "text-textPrimary text-4xl md:text-5xl"
            )}
            id="our-story"
          >
            ABOUT US
          </p>
        </div>
        <div className="md:col-span-1 mt-5 md:mt-7">
          <a href="#our-story" className="block text-textSecondary text-sm hover:text-textPrimary transition">
            OUR STORY
          </a>
          <a href="#vision" className="block text-textSecondary text-sm hover:text-textPrimary transition">
            VISION
          </a>
          <a href="#mission" className="block text-textSecondary text-sm hover:text-textPrimary transition">
            MISSION
          </a>
        </div>
        <div className="md:col-span-4">
          <p
            className={twMerge(
              latoRegular.className,
              "text-textSecondary text-base md:text-lg mt-5 md:mt-7"
            )}
          >
            Founded with a passion for preserving traditional Vietnamese
            craftsmanship, Global Handicrafts CO.,LTD began as a small workshop
            nestled at Duyen Thai Vilage. What started as a family endeavor has
            grown into a thriving business, dedicated to creating handcrafted
            masterpieces from the rich natural resources of our land. <br />
            <br />
            From the very beginning, we have believed in the power of art to
            tell stories, and every piece we produce is a testament to this
            belief. Our journey has been one of continuous learning, innovation,
            and a deep respect for the artisans who bring these stories to life.
            As we continue to grow, our commitment remains the same: to offer
            beautiful, sustainable, and meaningful products that honor our
            heritage and inspire a global audience.
          </p>
        </div>
      </div>

      <div className="relative w-full h-[34rem] md:h-[40rem] overflow-hidden flex items-center p-5 md:p-20">
        <Image
          className="object-cover w-full h-full"
          alt="background"
          src={"/images/about_us_1.png"}
          layout="fill"
        />
      </div>

      <div className="flex justify-center m-5 md:m-20"  id="vision">
        <p
          className={twMerge(
            cormorantMedium.className,
            "text-textPrimary text-xl md:text-4xl text-center max-w-screen-sm"
          )}
        >
          "Crafting the essence of nature into timeless art, one handcrafted
          piece at a time."
        </p>
      </div>
      <div className="m-5 md:m-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-full h-80 md:h-full">
            <Image
              fill
              objectFit="contain"
              src={"/images/about_us_2.png"}
              alt="product_link_image"
            />
          </div>
          <div className="mt-5 md:mt-8">
            <div id="mission">
              <h2
                className={twMerge(
                  cormorantRegular.className,
                  "text-textPrimary text-2xl md:text-4xl"
                )}
              >
                Mission to the Community
              </h2>
              <p
                className={twMerge(
                  latoRegular.className,
                  "max-w-screen-sm mt-4 md:mt-6 text-textSecondary text-base md:text-lg"
                )}
              >
                At Global Handicrafts CO.,LTD, we believe in the power of
                community and the importance of giving back. Our commitment goes
                beyond creating beautiful handcrafted products; it extends to
                supporting the artisans and communities who bring these
                creations to life. By sourcing materials locally and employing
                skilled craftsmen from rural areas, we help to sustain
                traditional craftsmanship and provide meaningful employment
                opportunities.
                <br /><br />
                Through our efforts, we aim to make a positive
                impact that resonates far beyond the beautiful items we create,
                fostering a future where traditional Vietnamese craftsmanship
                continues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
