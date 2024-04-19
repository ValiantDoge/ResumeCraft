import '../App.css';
// import HelloWorld from '../components/HelloWorld.jsx';
import Header from '../components/Header.jsx';
import TempSelect from '../components/TempSelect.jsx';
import ResumeForm from '../pages/ResumeForm.jsx';

function App() {

  return (
    <>
      <Header />

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap flex-col">
          
          <TempSelect />
        </div>
      </section>   
         
      {/* <HelloWorld /> */}
    </>
  );
}

export default App
