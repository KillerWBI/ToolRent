import Link from "next/link";
import { Tool } from "@/types/tool";
import css from "./ToolInfoBlock.module.css";
import { PublicUser } from "@/types/user";

type ToolInfoBlockProps = {
  tool: Tool;
  owner: PublicUser;
};

export const ToolInfoBlock = async ({ tool, owner }: ToolInfoBlockProps) => {
  const specifications = Object.entries(tool.specifications ?? {});

  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>{tool.name}</h2>
      <p className={css.price}>{tool.pricePerDay} грн/день</p>
      <div className={css.userProfile}>
        <div className={css.userIconWrap}>
          <img className={css.avatar} src={owner.avatarUrl} alt="owner.name" />
        </div>
        <div className={css.userInfo}>
          <p className={css.userName}>{owner.name}</p>
          <a href="" className={css.profileBtn} type="button">
            Переглянути профіль
          </a>
        </div>
      </div>
      <p className={css.description}>{tool.description}</p>
      <ul className={css.specificationsList}>
        {specifications.map(([label, value], index) => (
          <li key={index} className={css.specItem}>
            <span className={css.speclabel}>{label}: </span>
            {value}
          </li>
        ))}
      </ul>
      <Link href={`/dashboard/booking/${tool._id}`} className={css.rentBtn}>
        Забронювати
      </Link>
    </div>
  );
};
