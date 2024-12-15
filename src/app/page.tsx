

import Chatbox from "../components/chatbox"


export default function Home() {


  return (
      <div className="flex px-40">
  <div className="w-1/4 p-4 ">
    <div >
      <Chatbox/>
    </div>
  </div>

  <div className ="w-2/4 p-4">
    <div className ="bg-white shadow-lg rounded-lg p-4">
      
    </div>
  </div>
  <div className="w-1/4 p-4">
    <div className="bg-white shadow-lg rounded-lg p-4">
      
    </div>
  </div>
</div>
  );


  
}
