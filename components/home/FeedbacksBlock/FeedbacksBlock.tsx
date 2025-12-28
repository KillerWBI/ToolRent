"use client";

import StarRating from "./StarsRating";
import { Feedback } from "@/types/feedback";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./FeedbacksBlock.module.css";
import { Navigation, Pagination } from "swiper/modules";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/pagination";

type Props = {
  feedbacks: Feedback[];
  title: string;
  isShowFeedbackBtn?: boolean;
  onOpenFeedbackModal?: () => void;
};

export default function FeedbacksBlock({
  feedbacks,
  title,
  isShowFeedbackBtn,
  onOpenFeedbackModal,
}: Props) {
  return (
    <section className={`container ${styles.section}`}>
      <div className={styles.titleWrap}>
        <h2 className={styles.title}>{title}</h2>
        {isShowFeedbackBtn && (
          <button
            type="button"
            aria-label="Залишити відгук"
            onClick={onOpenFeedbackModal}
            className={styles.createFeedbackBtn}>
            Залишити відгук
          </button>
        )}
      </div>

      {feedbacks.length === 0 ? (
        <div className={styles.notFeedbacks}>
          <h3 className={styles.notFeedbacksTitle}>
            У цього інструменту немає жодного відгуку
          </h3>
          <p className={styles.notFeedbacksText}>
            Ми впевнені скоро їх буде значно більше!
          </p>
        </div>
      ) : (
        <div className={styles.sliderWrapper}>
          <Swiper
            modules={[Pagination, Navigation]}
            slidesPerView={1}
            pagination={{
              el: `.${styles.pagination}`,
              clickable: true,
              type: "bullets",
              //   dynamicBullets: true,
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
            }}>
            {feedbacks.map((feedback) => {
              const feedbackId =
                typeof feedback._id === "string"
                  ? feedback._id
                  : feedback._id.$oid;
              return (
                <SwiperSlide key={feedbackId}>
                  <div className={styles.card}>
                    <StarRating value={feedback.rate} />
                    <p className={styles.text}>{feedback.description}</p>
                    <span className={styles.name}>{feedback.name}</span>
                  </div>
                </SwiperSlide>
              );
            })}
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
      )}
    </section>
  );
}
