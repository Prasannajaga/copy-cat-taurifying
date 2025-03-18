
import {useCallback, useEffect, useRef, useState } from "react";
import "./App.css";  
import FloatingWindow from './components/floatingWindow';    
import { isRegistered, register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {debounce} from "lodash" 
// import { Window } from "@tauri-apps/plugin-window";



function App() {

  const [visible, setVisible] = useState(false); 
  const [appWindow] = useState(getCurrentWindow()); 
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    // shortcut listener
    const setupShortcut =  async () => {
      const hotkey = "Ctrl+Shift+M";

      try {
        const isRegister = await isRegistered(hotkey); 

        if(!isRegister){
          await register(hotkey , toggleWindow);
        } 

        console.log("Shortcut registered successfully!");
      } catch (error) {
        console.error("Failed to register shortcut:", error);
      }
    }

    // outside idle listener
     // Hide window when it loses focus
    // const handleBlur = () => {
    //   appWindow.hide();
    //   console.log("Window blurred, hiding...");
    // };

    // // Attach event listener
    // appWindow.listen("tauri://blur", handleBlur);


    // dragging listener
    const handleDrag = (event: MouseEvent) => {
      if (dragRef.current && dragRef.current.contains(event.target as Node)) {
        appWindow.startDragging();
      }
    };
 

    document.addEventListener("mousedown", handleDrag);

    setupShortcut();

    return () => {
      // if(await isRegistered("Ctrl+Shift+M")){
      try {
        unregister("Ctrl+Shift+M");
        document.removeEventListener("mousedown" , handleDrag);
      } catch (error) {
        console.log("unmount error => " , error);
      }  
      // } 
    };
  }, []);

  const toggleWindow = useCallback(
    debounce(() => {
      setVisible((prev) => {
        const newState = !prev;
        if (newState) {
          appWindow.show();
        } else {
          appWindow.hide();
        }
        return newState;
      });
    }, 200),  
    []
  );

 
  return <>{visible &&<FloatingWindow element={dragRef} callbackFn={toggleWindow} />
  }</>;

}

export default App;
