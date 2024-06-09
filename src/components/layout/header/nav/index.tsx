/* eslint-disable jsx-a11y/alt-text */
"use client";
import styles from "./style.module.scss";
import { useState } from "react";
import { motion } from "framer-motion";
import { height } from "../anim";
import Body from "./body";
import Footer from "./footer";
import Image from "./image";
import { useNavStore } from "~/store/navbar";

const links = [
  {
    title: "Home",
    href: "/",
    src: "https://uploads8.wikiart.org/images/john-singer-sargent/madame-x-also-known-as-madame-pierre-gautreau-1884(1).jpg!Large.jpg",
  },
  {
    title: "Cars",
    href: "/cars/all",
    src: "/assets/cars/floating/la.jpeg",
  },
  {
    title: "About Us",
    href: "/aboutus",
    src: "/assets/cars/floating/gt.jpeg",
  },
  {
    title: "Lookbook",
    href: "/lookbook",
    src: "/assets/cars/bmw.webp",
  },
  {
    title: "Contact",
    href: "/contact",
    src: "/assets/cars/floating/porsc.avif",
  },
];

export default function Index() {
  const [selectedLink, setSelectedLink] = useState({
    isActive: false,
    index: 0,
  });
  const setInactive = useNavStore((state) => state.setInactive);
  return (
    <motion.div
      variants={height}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.nav}
    >
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Body
            links={links}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            onLinkClick={setInactive}
          />
          <Footer />
        </div>
        <Image
          src={links[selectedLink.index].src}
          isActive={selectedLink.isActive}
        />
      </div>
    </motion.div>
  );
}
