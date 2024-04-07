import Form from "../components/Form";
import Header from '../components/Header.jsx';
import { useParams } from "react-router-dom";

export default function ResumeForm(){
    const { tempId } = useParams();
    const imgUrl = `/resTemplates/template${tempId}.png`;
    return (
        <div>
            <Header />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="p-10 flex justify-center">
                    <img src={ imgUrl } className="w-1/2 bg-slate-200 p-3 rounded-md" alt="resumeTemplate" />
                </div>

                <Form />
            </div>
            
        </div>
    )
}