import axios from "axios";
import { useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";
// import { useNavigate } from "react-router-dom";

const steps = [
  { id: "Step 1", name: "Personal Details" },
  { id: "Step 2", name: "Education" },
  { id: "Step 3", name: "Skills" },
  { id: "Step 4", name: "Languages"},
  { id: "Step 5", name: "Work Experience" }
]


export default function Form(){

    

    const [curFormStep, setCurFormstep] = useState(0);

    const handleNext = () => {
      if(curFormStep < steps.length - 1){
        setCurFormstep(step => curFormStep + 1)
      }
    }

    const handlePrev = () => {
      if (curFormStep > 0) {
        setCurFormstep(step => curFormStep - 1)
      }
    }

    
  
    const resumeForm = useForm({
      defaultValues: {
        name: {
          fname: "",
          lname: "",
        },
        email: "",
        phoneNo: "",
        profile: "",
        profession: "",
        
        content: {
          education: [{
            uniName: "",
            eddesc: "",
          }],
          skills: [{
            skill:"",
            skillLevel: ""
          }],
          languages: [{lang: ""}],
          workExp: [{
              jobTitle: "",
              company: "",
              jobDesc: "",
              startDate: "",
              endDate: "",
            }],
        }

        }
      },
    );
    const { register, control, handleSubmit, formState, setValue } = resumeForm;

    const handlePresentChange = (e, index) => {
      const isChecked = e.target.checked;
      if (isChecked) {
        setValue(`content.workExp.${index}.endDate`, 'Present'); // Set the value of endDate field to 'Present'
        document.getElementById(`id_end${index}`).disabled = true; // Disable the endDate field
      } else {
        setValue(`content.workExp.${index}.endDate`, ''); // Clear the value of endDate field
        document.getElementById(`id_end${index}`).disabled = false; // Disable the endDate field
      }
    };

    function watchLength(e,limit) {
      return limit - e.target.value.length;
    }

    const { errors } = formState;
    const { fields: edFields, append: edAppend, remove: edRemove } = useFieldArray({
      name: 'content.education',
      control
    })
    const { fields: skillFields, append: skillAppend, remove: skillRemove } = useFieldArray({
      name: 'content.skills',
      control
    })

    const { fields: langFields, append: langAppend, remove: langRemove } = useFieldArray({
      name: 'content.languages',
      control
    })

    const { fields: wrkFields, append: wrkAppend, remove: wrkRemove } = useFieldArray({
      name: 'content.workExp',
      control
    })
    
    

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
      formField.append("profession", data.profession);
      formField.append("education", JSON.stringify(data.content.education));
      formField.append("skills", JSON.stringify(data.content.skills));
      formField.append("languages", JSON.stringify(data.content.languages));
      formField.append("workExp", JSON.stringify(data.content.workExp));
      
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
      <section className="userForm flex-row justify-center lg:justify-start items-center w-full ">
        <nav
          aria-label="Progress"
          className="flex justify-center items-center  mx-auto flex-wrap"
        >
          {steps.map((step, index) => (
            <button onClick={() => setCurFormstep(index)}>
              {curFormStep === index ? (
                <a
                  key={step.name}
                  className="sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium bg-gray-100 inline-flex items-center leading-none border-indigo-500 text-indigo-500 tracking-wider rounded-t"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5 mr-3"
                  >
                    <path d="M10.061 19.061 17.121 12l-7.06-7.061-2.122 2.122L12.879 12l-4.94 4.939z"></path>
                  </svg>
                  {step.name}
                </a>
              ) : (
                <a
                  key={step.name}
                  className="sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5 mr-3"
                  >
                    <path d="M10.061 19.061 17.121 12l-7.06-7.061-2.122 2.122L12.879 12l-4.94 4.939z"></path>
                  </svg>
                  {step.name}
                </a>
              )}
            </button>
          ))}

          
        </nav>

            
        <form
          className="bg-slate-100 p-6 px-32 rounded-md"
          onSubmit={handleSubmit(sendData)}
          noValidate
        >
          {curFormStep === 0 && (
            <section id="personal-form">
                <h2 className="text-2xl font-mono mb-6">Personal Details</h2>
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
                  <input
                    type="text"
                    id="id_prof"
                    maxLength={36}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    {...register("profession", {
                      required: "Profession is required", maxLength: {value: 36, message: "Maximum 36 characters allowed"}
                    })}
                  />
                  <p className="text-red-500">{errors.profession?.message}</p>
                  <label
                    htmlFor="id_prof"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Profession (Example: Student)
                  </label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <textarea
                    type="text"
                    maxLength={300}
                    id="id_profile"
                    className="relative block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    {...register("profile", {
                      required: "This field is required",
                      maxLength: {
                        value: 300,
                        message: "Maximum 300 characters allowed",
                      },
                    })}
                    onChange={(e) => {
                      const profChars = watchLength(e, 300); 
                      document.getElementById("profCount").innerText = profChars;
                    }}
                  />
                  <span className="absolute -bottom-5 right-1 text-sm text-gray-400">
                  <span id="profCount">300</span>/300
                  </span>
                  <p className="text-red-500">{errors.profile?.message}</p>

                 
                  <label
                    htmlFor="id_profile"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    About you
                  </label>
                </div>
                </section>
          )}
          
          
          

          <div className="grid grid-cols-1">
            {curFormStep === 1 && (
              <section id="education-section">
              <h2 className="text-2xl font-mono mb-6">Add Education (Max. 2)</h2>
              <div>
                {edFields.map((field, index) => {
                  return (
                    <div className="relative" key={field.id}>
                      <h2 className="text-lg mb-6">
                        Education Details {index + 1}
                      </h2>
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          id={`id_uniName${index}`}
                          maxLength={50}
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          // placeholder="Univercity/College/School Name"
                          placeholder=" "
                          {...register(`content.education.${index}.uniName`, {maxLength: {
                            value: 50,
                            message: "Maximum 50 characters allowed",
                          },})}
                        />
                        <label
                          htmlFor={`id_uniName${index}`}
                          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Name of Institute
                        </label>
                      </div>

                      <div className="relative z-0 w-full mb-5 group">
                        <textarea
                          type="text"
                          maxLength={100}
                          id={`id_eddesc${index}`}
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          // placeholder="Mention the degree or course you have done or time period of study"
                          placeholder=" "
                          {...register(`content.education.${index}.eddesc`, {
                            maxLength: {
                              value: 100,
                              message: "Maximum 110 characters allowed",
                            },
                          })}

                          onChange={(e) => {
                            const edDesChars = watchLength(e, 100);
                            document.getElementById(`edDesCount${index}`).innerText = edDesChars;
                          }}
                        />
                         <span className="absolute -bottom-5 right-1 text-sm text-gray-400">
                          <span id={`edDesCount${index}`}>100</span>/100
                          </span>
                          <p className="text-red-500">{errors.content?.education?.eddesc?.message}</p>
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
                    onClick={() => edAppend({ uniName: "", eddesc: "" })}
                    disabled={edFields.length >= 2}
                    type="button"
                    className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add another education
                  </button>
                </div>
              </div>
              </section>
            )}
            
            
            {curFormStep === 2 && (
              <section id="skill-section">
                <h2 className="text-2xl font-mono mb-6">Skills</h2>
                <div>
                  {skillFields.map((field, index) => {
                    return (
                      <div className="relative" key={field.id}>
                        <h2 className="text-lg mb-6">Skillset {index + 1}</h2>
                        <div className="relative z-0 w-full mb-5 group">
                          <input
                            type="text"
                            id={`id_skill${index}`}
                            maxLength={18}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            // placeholder="Univercity/College/School Name"
                            placeholder=" "
                            {...register(`content.skills.${index}.skill`, {
                              maxLength: {
                              value: 18,
                              message: "Maximum 18 characters allowed",
                            },})}
                          />
                          <label
                            htmlFor={`id_skill${index}`}
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Skill
                          </label>
                        </div>
  
                        <div className="relative z-0 w-full mb-5 group">
                          <select
                            id={`id_skillLevel${index}`}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            {...register(`content.skills.${index}.skillLevel`)}
                            defaultValue={{
                              label: "Choose a Skill Level",
                              value: 0,
                            }}
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
                      onClick={() => skillAppend({ skill: "", skillLevel: "" })}
                      disabled={skillFields.length >= 4}
                      type="button"
                      className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add Skill
                    </button>
                  </div>
                </div>
              </section>
            )}
            
            {curFormStep === 3 && (
                <section id="lang-section">
                <h2 className="text-2xl font-mono mb-6">Languages Spoken</h2>
                <div>
                  {langFields.map((field, index) => {
                    return (
                      <div className="relative" key={field.id}>
                        <h2 className="text-lg mb-6">Language {index + 1}</h2>
                        <div className="relative z-0 w-full mb-5 group">
                          <input
                            type="text"
                            id={`id_lang${index}`}
                            maxLength={18}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            // placeholder="Univercity/College/School Name"
                            placeholder=" "
                            {...register(`content.languages.${index}.lang`, {maxLength: {
                              value: 18,
                              message: "Maximum 18 characters allowed",
                            },})}
                          />
                          <label
                            htmlFor={`id_lang${index}`}
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Language
                          </label>
                        </div>
  
                        {index > 0 && (
                          <button
                            onClick={() => langRemove(index)}
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
                      onClick={() => langAppend({ lang: "" })}
                      disabled={langFields.length >= 4}
                      type="button"
                      className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add Language
                    </button>
                  </div>
                </div>
              </section>
            )}

            {curFormStep === 4 && (
                <section id="wrk-section">
                <h2 className="text-2xl font-mono mb-6">Work Experience (If any)</h2>
                <div>
                  {wrkFields.map((field, index) => {
                    return (
                      <div className="relative" key={field.id}>
                        <h2 className="text-lg mb-6">Work Experience {index + 1}</h2>
                        <div className="relative z-0 w-full mb-5 group">
                          <input
                            type="text"
                            maxLength={50}
                            id={`id_jobT${index}`}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            // placeholder="Univercity/College/School Name"
                            placeholder=" "
                            {...register(`content.workExp.${index}.jobTitle`, {maxLength: {
                              value: 50,
                              message: "Maximum 50 characters allowed",
                            },})}
                          />
                          <label
                            htmlFor={`id_jobT${index}`}
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Job Title
                          </label>

                          
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                          <input
                              type="text"
                              id={`id_comp${index}`}
                              maxLength={30}
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              // placeholder="Univercity/College/School Name"
                              placeholder=" "
                              {...register(`content.workExp.${index}.company`, {maxLength: {
                                value: 30,
                                message: "Maximum 30 characters allowed",
                              },})}
                            />
                            <label
                              htmlFor={`id_comp${index}`}
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Company name
                            </label>

                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                        <textarea
                          type="text"
                          maxLength={100}
                          id={`id_jobdesc${index}`}
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          // placeholder="Mention the degree or course you have done or time period of study"
                          placeholder=" "
                          {...register(`content.workExp.${index}.jobDesc`, {
                            maxLength: {
                              value: 100,
                              message: "Maximum 100 characters allowed",
                            },
                          })}

                          onChange={(e) => {
                            const jobDescChars = watchLength(e, 100);
                            document.getElementById(`jobDescCount${index}`).innerText = jobDescChars;
                          }}
                        />
                         <span className="absolute -bottom-5 right-1 text-sm text-gray-400">
                          <span id={`jobDescCount${index}`}>100</span>/100
                          </span>
                          <p className="text-red-500">{errors.content?.workExp?.jobDesc?.message}</p>
                        <label
                          htmlFor={`id_jobdesc${index}`}
                          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Job Description
                        </label>
                      </div>

                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="relative z-0 w-full mb-5 group ">
                                <input
                                type="month"
                                id={`id_start${index}`}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                // placeholder="Univercity/College/School Name"
                                placeholder=" "
                                {...register(`content.workExp.${index}.startDate`)}
                              />
                              <label
                                htmlFor={`id_start${index}`}
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                Start Date
                              </label>
                          </div>

                          <div className="relative z-0 w-full mb-5 group ">
                            <input
                                  type="month"
                                  id={`id_end${index}`}
                                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                  // placeholder="Univercity/College/School Name"
                                  placeholder=" "
                                  {...register(`content.workExp.${index}.endDate`)}
                                />
                                <label
                                  htmlFor={`id_end${index}`}
                                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                  End Date
                                </label>

                              
                          </div>

                          </div>
                          <div className="flex w-full justify-end mb-6">
                          <label
                                  htmlFor={`id_present${index}`}
                                  className="peer-focus:font-medium text-sm mr-10"
                                >
                                  Present
                                </label>
                            <input type="checkbox" id={`id_present${index}`} onChange={(e) => {handlePresentChange(e, index)}} />

                            
                          </div>
  
                        {index > 0 && (
                          <button
                            onClick={() => wrkRemove(index)}
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
                      onClick={() => wrkAppend({ jobTitle: "", company: "", jobDesc: "", startDate: "", endDate: "" })}
                      type="button"
                      className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={wrkFields.length >= 2}
                    >
                      Add Work Experience
                    </button>
                  </div>
                </div>

                <button
                  // onClick={(e)=>sendData(e)}
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Submit
                </button>
              </section>
            )}
            
            
          </div>

          
              {/* Navigation */}
          <div className='py-5'>
            <div className='flex justify-between'>
              <button
                type='button'
                onClick={handlePrev}
                disabled={curFormStep === 0}
                className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5L8.25 12l7.5-7.5'
                  />
                </svg>
              </button>
              <button
                type='button'
                onClick={handleNext}
                disabled={curFormStep === steps.length - 1}
                className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                  />
                </svg>
              </button>
            </div>
          </div>

        </form>

        
      </section>
    );
}