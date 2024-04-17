import axios from "axios";
import { useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
// import { useNavigate } from "react-router-dom";

export default function Form(){

    

    const resumeForm = useForm({
      defaultValues: {
        name: {
          fname: "",
          lname: "",
        },
        email: "",
        phoneNo: "",
        profile: "",
        
        content: {
          education: [{
            uniName: "",
            eddesc: "",
          }],
          skills: [{
            skill:"",
            skillLevel: ""
          }]
        }

        }
      },
    );
    const { register, control, handleSubmit, formState } = resumeForm;
    const { errors } = formState;
    const { fields: edFields, append: edAppend, remove: edRemove } = useFieldArray({
      name: 'content.education',
      control
    })
    const { fields: skillFields, append: skillAppend, remove: skillRemove } = useFieldArray({
      name: 'content.skills',
      control
    })
    
    const [profileChars, setProfileChars] = useState(0);
    function countChars(e) {
      setProfileChars(250 - e.target.value.length);
    }

    const { tempId } = useParams();
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

    const sendData = async(data) => {
      
      let formField = new FormData();
      formField.append("tempId", tempId);
      formField.append("fname", data.name.fname);
      formField.append("lname", data.name.lname);
      formField.append("email", data.email);
      formField.append("contactNo", data.phoneNo);
      formField.append("profile", data.profile);
      formField.append("education", JSON.stringify(data.content.education));
      formField.append("skills", JSON.stringify(data.content.skills));
      console.log(data.content.education);
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
        <form
          className="bg-slate-100 p-6 px-32 rounded-md"
          onSubmit={handleSubmit(sendData)}
          noValidate
        >
          <h2 className="text-2xl font-mono mb-6">User Form</h2>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div
              onClick={handleuploadImage}
              className="col-span-2 flex flex-col justify-center items-center"
            >
              <p className="font-serif text-xl">Upload Image</p>

              {usrImg ? (
                <img
                  src={URL.createObjectURL(usrImg)}
                  alt="uploadImg"
                  id="uploadUserImg"
                  className="w-44 h-44 p-5"
                />
              ) : (
                <img
                  src="/uploadImg.png"
                  alt="uploadImg"
                  id="uploadUserImg"
                  className="w-44 h-44 p-5"
                />
              )}
              <input
                type="file"
                name="userPicture"
                onChange={handleImageChange}
                className="hidden"
                id="img"
                ref={inputImgRef}
              />
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input
                // onChange={(e) => {setDetail({...personalDetails, fname: e.target.value })}}

                type="text"
                id="id_fname"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                {...register("name.fname", {
                  required: "First name is required",
                })}
              />
              <p className="text-red-500">{errors.name?.fname?.message}</p>
              <label
                htmlFor="id_fname"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                First name
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                id="id_lname"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none :text-white  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                {...register("name.lname")}
              />
              <label
                htmlFor="id_lname"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Last name
              </label>
            </div>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              id="id_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              {...register("email", {
                required: "Email is required",
              })}
            />
            <p className="text-red-500">{errors.email?.message}</p>
            <label
              htmlFor="id_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              id="id_phoneNo"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              {...register("phoneNo", {
                required: "Phone No. is required",
              })}
            />
            <p className="text-red-500">{errors.phoneNo?.message}</p>
            <label
              htmlFor="id_phoneNo"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Phone number (123-456-7890)
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <textarea
              type="text"
              maxLength={250}
              id="id_profile"
              className="relative block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              {...register("profile", {
                required: "This field is required",
                maxLength: {
                  value: 250,
                  message: "Maximum 250 characters allowed",
                },
                },
            
            )}

            onChange={(e) => {
              countChars(e); // Call your custom function here
            }}
            
            />
            <span className="absolute -bottom-5 right-1 text-sm text-gray-400">{profileChars}/250</span>
            <p className="text-red-500">{errors.profile?.message}</p>
            <label
              htmlFor="id_profile"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              About you
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
            

          <div className="grid grid-cols-1">
            <h2 className="text-2xl font-mono mb-6">Add Education</h2>
            <div>
              {edFields.map((field, index) => {
                return (
                  <div className="relative" key={field.id}>
                    <h2 className="text-lg mb-6">Education Details {index}</h2>
                    <div
                      className="relative z-0 w-full mb-5 group"
                      
                    >
                      <input
                        type="text"
                        id={`id_uniName${index}`}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        // placeholder="Univercity/College/School Name"
                        placeholder=" "
                        {...register(`content.education.${index}.uniName`)}
                      />
                      <label
                        htmlFor={`id_uniName${index}`}
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Name of Institute
                      </label>
                    </div>

                    <div
                      className="relative z-0 w-full mb-5 group"
                      
                    >
                      <textarea
                        type="text"
                        id={`id_eddesc${index}`}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        // placeholder="Mention the degree or course you have done or time period of study"
                        placeholder=" "
                        {...register(`content.education.${index}.eddesc`)}
                      />
                      <label
                        htmlFor={`id_eddesc${index}`}
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Description
                      </label>
                    </div>

                    {index > 0 && (
                      <button
                        onClick={() => edRemove(index)}
                        type="button"
                        className="absolute rounded-full bg-red-500 top-0 right-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
              <div className="flex w-full space-x-2 justify-end">
                <button
                onClick={() => edAppend({uniName: "", eddesc: ""})}
                  type="button"
                  className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5"
                >
                  Add another education
                </button>
              </div>
            </div>




            <h2 className="text-2xl font-mono mb-6">Skills</h2>
            <div>
              {skillFields.map((field, index) => {
                return (
                  <div className="relative" key={field.id}>
                    <h2 className="text-lg mb-6">Skillset {index}</h2>
                    <div
                      className="relative z-0 w-full mb-5 group"
                      
                    >
                      <input
                        type="text"
                        id={`id_skill${index}`}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        // placeholder="Univercity/College/School Name"
                        placeholder=" "
                        {...register(`content.skills.${index}.skill`)}
                      />
                      <label
                        htmlFor={`id_skill${index}`}
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Skill
                      </label>
                    </div>

                    <div
                      className="relative z-0 w-full mb-5 group"
                      
                    >
                    
                      <select 
                      id={`id_skillLevel${index}`}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      {...register(`content.skills.${index}.skillLevel`)}
                      defaultValue={{ label: "Choose a Skill Level", value: 0 }}
                      >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advance">Advance</option>
                      </select>


                      <label
                        htmlFor={`id_skillLevel${index}`}
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Skill Level
                      </label>
                    </div>

                    {index > 0 && (
                      <button
                        onClick={() => skillRemove(index)}
                        type="button"
                        className="absolute rounded-full bg-red-500 top-0 right-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
              <div className="flex w-full space-x-2 justify-end">
                <button
                onClick={() => skillAppend({skill: "", skillLevel: ""})}
                  type="button"
                  className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>

          

          <button
            // onClick={(e)=>sendData(e)}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Submit
          </button>
        </form>
        <DevTool control={control} />
      </section>
    );
}