'use client';

import css from "./RegistrationBlock.module.css";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RegistrationBlock() {
    const router = useRouter();

    const handleButtonClick = () => {
        router.push('');
     };

    return (
        <section className={css.section}>
            <div className={css.div}>
                <h2 className={css.title}>Зареєструйтесь і отримайте доступ до інструментів поруч із вами</h2>
                <p className={css.text}>Не витрачайте гроші на купівлю — орендуйте зручно та швидко. Приєднуйтесь до ToolNext вже сьогодні!</p>
                <button type='button' onClick={handleButtonClick} className={css.button}>Зареєструватися</button>
                <Image src='/image/registerBlockimg.jpg' alt='shelf with tools' width={335} height={223} className={css.RgImg}></Image> 
            </div>        
        </section>
    )
}