'use client';

import StarRating from "./StarsRating";
import { Feedback } from "@/types/feedback";
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from "./FeedbacksBlock.module.css";
import { Navigation, Pagination } from 'swiper/modules';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/pagination';

type Props = {
  feedbacks: Feedback[];
};

export default function FeedbacksBlock({ feedbacks }: Props) {
  return (
    <section className={`container ${styles.section}`}>
      <h2 className={styles.title}>Останні відгуки</h2>

      <div className={styles.sliderWrapper}>
        <Swiper
          modules={[Pagination, Navigation]}
          slidesPerView={1}
          pagination={{
            el: `.${styles.pagination}`,
            clickable: true,
            type: 'bullets',
            renderBullet: (_, className) => {
              return `<span class="${className} ${styles.bullet}"></span>`;
            },
          }}
          navigation={{
            prevEl: `.${styles.prev}`,
            nextEl: `.${styles.next}`,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 32,
            },
            1440: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
        >
          {feedbacks.map((feedback) => (
            <SwiperSlide key={feedback._id.$oid}>
              <div className={styles.card}>
                <StarRating value={feedback.rate} />
                <p className={styles.text}>{feedback.description}</p>
                <span className={styles.name}>{feedback.name}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ⬇️ КЕРУВАННЯ */}
        <div className={styles.controls}>
          <div className={styles.pagination} />

          <div className={styles.arrows}>
            <button className={styles.prev} aria-label="Previous slide">
              <FiArrowLeft />
            </button>
            <button className={styles.next} aria-label="Next slide">
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}