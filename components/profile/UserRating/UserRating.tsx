import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import styles from "./UserRating.module.css";

type Props = {
    rating: number;
    reviewsCount: number;
};

export default function UserRating({ rating = 0, reviewsCount = 0 }: Props) {
    return (
        <div
            className={styles.ratingWrapper}
            aria-label={`Рейтинг ${rating} з 5`}
        >
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((i) => {
                    if (rating >= i) return <FaStar key={i} />;
                    if (rating >= i - 0.5) return <FaStarHalfAlt key={i} />;
                    return <FaRegStar key={i} />;
                })}
            </div>
            <span className={styles.count}>
                ({rating.toFixed(1)}) • {reviewsCount} відгуків
            </span>
        </div>
    );
}
