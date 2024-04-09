import axios from "axios";
import { useState, useRef } from "react";
import { useParams } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";

export default function Form(){
    const { tempId } = useParams();
    const [personalDetails, setDetail] = useState({fname:"", lname:"", email:"", contactNo:"", usrImg: null});
    const inputImgRef = useRef(null);
    const [usrImg, setUsrImg] = useState(null);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      const imgname = e.target.files[0].name;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = Math.max(img.width, img.height);
          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx = canvas.getContext("2d");

          //Set Canvas to Transparant
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.beginPath();
          ctx.arc(maxSize / 2, maxSize / 2, maxSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(
              img,
              0, 0, maxSize, maxSize
            );

          canvas.toBlob(
            (blob) => {
              const file = new File([blob], imgname, {
                type: "image/png",
                lastModified: Date.now(),
              });
  
              // console.log(file);
              setUsrImg(file);

              // const downloadLink = document.createElement("a");
              // downloadLink.href = URL.createObjectURL(file);
              // downloadLink.download = imgname;
              // downloadLink.click();
            },
            "image/png",
            0.8
          );
        };
      };
      document.getElementById("uploadUserImg").classList.add('rounded-full');

    }

    const handleuploadImage = () => {
      inputImgRef.current.click();
    }
    // const navigateTo = useNavigate();

    const sendData = async(e) => {
      e.preventDefault();
      let formField = new FormData();
      formField.append("tempId", tempId);
      formField.append("fname", personalDetails.fname);
      formField.append("lname", personalDetails.lname);
      formField.append("email", personalDetails.email);
      formField.append("contactNo", personalDetails.contactNo);
      if (Image !== null) {
        formField.append("userPicture", usrImg)
      }
      
      console.log(formField.get("fname"));

      await axios({
        method:'POST', 
        url: 'http://localhost:8000/create-resume/',
        data: formField,
        responseType: 'blob'
      }).then((response) => {
        // console.log(response.data);
        // navigateTo('/');

        
        //download file here
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'resume.pdf');
        document.body.appendChild(link);
        link.click();
      })



    }

    return (
      <section className="userForm flex justify-center lg:justify-start items-center w-full ">
        <form className="bg-slate-100 p-6 px-32 rounded-md">
        <h2 className="text-2xl font-mono mb-6">User Form</h2>
        <div className="grid md:grid-cols-2 md:gap-6">

            <div onClick={handleuploadImage} className="col-span-2 flex flex-col justify-center items-center">
                <p className="font-serif text-xl">Upload Image</p>
                

                {usrImg ? (
                  <img src={URL.createObjectURL(usrImg)} alt="uploadImg" id="uploadUserImg" className="w-44 h-44 p-5" />
                ) : (
                  <img src="/uploadImg.png" alt="uploadImg" id="uploadUserImg" className="w-44 h-44 p-5" />
                )}
                <input type="file" name="userPicture" onChange={ handleImageChange } className="hidden" id="img"  ref={inputImgRef}/>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input
                onChange={(e) => {setDetail({...personalDetails, fname: e.target.value })}}
                type="text"
                name="fname"
                id="id_fname"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={personalDetails.fname}
                required
              />
              <label
                for="id_fname"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                First name
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                onChange={(e)=> {setDetail({...personalDetails, lname:e.target.value})}}
                type="text"
                name="lname"
                id="id_lname"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none :text-white  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={personalDetails.lname}
                required
              />
              <label
                for="id_lname"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Last name
              </label>
            </div>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              onChange={(e)=>{setDetail({...personalDetails, email:e.target.value})}}
              type="email"
              name="email"
              id="id_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={personalDetails.email}
              required
            />
            <label
              for="id_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
          </div>

          
          
            <div className="relative z-0 w-full mb-5 group">
              <input
                onChange={(e)=>{setDetail({...personalDetails, contactNo:e.target.value})}}
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                name="phoneNo"
                id="id_phoneNo"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="id_phoneNo"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Phone number (123-456-7890)
              </label>
            </div>
            {/* <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="floating_company"
                id="floating_company"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="floating_company"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Company (Ex. Google)
              </label>
            </div> */}
         
          <button
            onClick={(e)=>sendData(e)}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Submit
          </button>
        </form>
      </section>
    );
}