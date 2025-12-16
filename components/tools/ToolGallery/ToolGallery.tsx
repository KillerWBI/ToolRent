import css from "./ToolGallery.module.css";

export const ToolGallery = () => {
  return (
    <div className={css.imgWrap}>
      <img
        className={css.image}
        src={
          "https://ftp.goit.study/img/tools-next/692db3ffab59e437964311d4.webp"
        }
      />
    </div>
  );
};
