import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icon/fa";
import styles from './StarsRating.module.css';

type Props = {
  value: number;
};

export default function Stars({ value }: Props) {
  return (
    <div className={styles.stars} aria-label={`Рейтинг ${value} з 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        if (value >= i) return <FaStar key={i} />;
        if (value >= i - 0.5) return <FaStarHalfAlt key={i} />;
        return <FaRegStar key={i} />;
      })}
    </div>
  );
}