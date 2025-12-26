import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import styles from "./ReviewsBlock.module.css";

import { Feedback } from "@/types/feedback";

type Props = {
    feedbacks: Feedback[];
};

function ReviewStars({ value }: { value: number }) {
    return (
        <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => {
                if (value >= i) return <FaStar key={i} />;
                if (value >= i - 0.5) return <FaStarHalfAlt key={i} />;
                return <FaRegStar key={i} />;
            })}
        </div>
    );
}

export default function ReviewsBlock({ feedbacks }: Props) {
    if (!feedbacks || feedbacks.length === 0) {
        return (
            <section className={styles.section}>
                <h2 className={styles.title}>Відгуки</h2>
                <div className={styles.emptyState}>
                    <h3 className={styles.emptyTitle}>
                        У цього користувача немає жодного відгуку
                    </h3>
                    <p className={styles.emptyText}>
                        Ми впевнені скоро їх буде значно більше!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Відгуки</h2>
            <div className={styles.grid}>
                {feedbacks.map((feedback) => (
                    <div
                        key={
                            typeof feedback._id === "string"
                                ? feedback._id
                                : feedback._id.$oid
                        }
                        className={styles.card}
                    >
                        <div className={styles.cardHeader}>
                            <ReviewStars value={feedback.rate} />
                        </div>
                        <p className={styles.reviewText}>
                            {feedback.description}
                        </p>
                        <span className={styles.reviewAuthor}>
                            {feedback.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
