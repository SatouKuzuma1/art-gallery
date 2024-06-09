import styles from "./style.module.scss";
import { translate } from "../../anim";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <ul>
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span>Made by:</span>
          <em className="text-white "> Studio Psychopass </em>
        </motion.li>
      </ul>
      <ul>
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span>Typography:</span>{" "}
          <em className="text-white"> Google Fonts </em>
        </motion.li>
      </ul>
      <ul>
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span>Images:</span>
          <em className="text-white"> Freepik, Envato </em>
        </motion.li>
      </ul>
      <ul>
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span>The Cars of Tomorrow:</span>{" "}
          <em className="text-white"> Today</em>{" "}
        </motion.li>
      </ul>
    </div>
  );
}
