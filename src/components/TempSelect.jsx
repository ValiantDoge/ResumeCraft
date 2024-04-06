
export default function TempSelect() {
    return (
      <div className="container px-5 py-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          <div className="w-auto sm:mb-0 mb-6 rounded-md">
            <div className="dcard group relative rounded-lg">

                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                
               <div className="card">
                    <img
                    alt="template1"
                    className="rounded-md shadow-lg object-fit md:object-contain h-full w-full"
                    src={"/resTemplates/template1.png"}
                />

                <div className="hidden group-hover:flex absolute left-0 right-0 bottom-0 top-0 m-auto justify-center items-center">
                    <p className=" text-white p-3 rounded-lg relative z-10">Craft Resume</p>
                    <div className="absolute rounded-xl h-14 w-52 bg-opacity-70 bg-gray-500 mb-2"></div>
                    <div className="absolute rounded-xl h-14 w-52 bg-opacity-70 bg-gray-500 ml-4 mt-2"></div>
                </div>
               </div>
            </div>
            <h2 className="text-xl font-medium title-font text-gray-900 mt-5">
              Simple Student Resume
            </h2>
            <p className="text-base leading-relaxed mt-2">
            Suitable for students seeking part-time jobs, internships, or entry-level positions.
            </p>
            <a className="text-indigo-500 inline-flex items-center mt-3">
              Craft Resume
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>


          <div className="w-auto sm:mb-0 mb-6 rounded-md">
            <div className="dcard group relative rounded-lg">

                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                <div className="trigger"></div>
                
               <div className="card">
                    <img
                    alt="template2"
                    className="rounded-md shadow-lg object-fit md:object-contain h-full w-full"
                    src={"/resTemplates/template2.jpg"}
                />

                <div className="hidden group-hover:flex absolute left-0 right-0 bottom-0 top-0 m-auto justify-center items-center">
                    
                    <p className=" text-white p-3 rounded-lg relative z-10">Craft Resume</p>
                    <div className="absolute rounded-xl h-14 w-52 bg-opacity-70 bg-gray-500 mb-2"></div>
                    <div className="absolute rounded-xl h-14 w-52 bg-opacity-70 bg-gray-500 ml-4 mt-2"></div>
                </div>
               </div>
            </div>
            <h2 className="text-xl font-medium title-font text-gray-900 mt-5">
            The Pragmatic Engineer's Resume Template
            </h2>
            <p className="text-base leading-relaxed mt-2">
            Suitable for students seeking part-time jobs, internships, or entry-level positions.
            </p>
            <a className="text-indigo-500 inline-flex items-center mt-3">
              Craft Resume
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
          
        </div>
      </div>
    );

    
}