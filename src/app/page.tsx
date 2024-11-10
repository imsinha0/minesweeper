
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Chatbox from "../components/chatbox"


export default function Home() {
  return (


<div className="flex px-40">
  <div className="w-1/3 p-4 ">
    <div > {/* className="bg-white shadow-lg rounded-lg p-4" */}

      <Chatbox/>
    </div>
  </div>

  <div className ="w-2/3 p-4">
    <div className ="bg-white shadow-lg rounded-lg p-4">
    </div>
  </div>
</div>

  );
}
