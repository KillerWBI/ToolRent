import { useRouter } from 'next/navigation';
import "./BookingToolForm";



export function SuccessBookung () {
const router  = useRouter();

    return(
<>
        <div className="Success-form">
            <h1 className="title">Інструмент успішно заброньовано</h1>
            <div className="priceBlock">
              Власник інструмент скоро з вами звʼяжеться стововно деталей та оплати вашої броні
            </div>
            <div className="formFooter-sumbit">
                <button type="submit" onClick={() => router.push('/')} className="submit" >
              На головну
            </button></div>
        </div>

</>
    );
};

