import css from "./ToolInfoBlock.module.css";

export const ToolInfoBlock = () => {
  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>Дриль алмазного свердління</h2>
      <p className={css.price}>900 грн/день</p>
      <div className={css.userProfile}>
        <div className={css.userIcon}></div>
        <div className={css.userInfo}>
          <p className={css.userName}>Антон Петренко</p>
          <button className={css.profileBtn} type="button">
            Переглянути профіль
          </button>
        </div>
      </div>
    </div>
  );
};
