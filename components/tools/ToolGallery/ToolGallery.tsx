import { Tool } from "@/types/tool";
import css from "./ToolGallery.module.css";

type ToolGalleryProps = {
  tool: Tool;
};

export const ToolGallery = ({ tool }: ToolGalleryProps) => {
  return (
    <div className={css.imgWrap}>
      <img className={css.image} src={tool.images} />
    </div>
  );
};
