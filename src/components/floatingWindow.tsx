import { useState, useEffect, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core'; 
import {  matchPattern, TYPE_COLORS } from '../json/FORMAT_TYPE';

interface ClipboardItem {
  text: string;
  source: string;
  type ?: string,
  active?:boolean
}
 
const STORAGE_KEY = 'clipboard-history'; 

function FloatingWindow({element , callbackFn} : any) {
  
  const [items, setItems] = useState<ClipboardItem[]>(() => { 
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [filter] = useState('');
  // const [typeFormats] = useState(AVAILABLE_TYPE_FORMATS);

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const data = await invoke<any>('get_clipboard_text');
        if (data.text && !items.some(x => x.text === data.text)) { 
          const newItems = [{
            text: data.text,
            source: data.source,
            active : true,
            type : matchPattern(data.text)
          }, ...items];
          setItems(newItems);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        }
      } catch (error) {
        console.error('Failed to read clipboard:', error);
      }
    }; 

    const interval = setInterval(checkClipboard, 1000);
    return () => clearInterval(interval);
  }, [items]);
  

  const handleCopy = async (text: any) => { 
    try {
       await invoke('set_clipboard_text', { text });      
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClearAll = (e:any) => {
    e.preventDefault();
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // const filterApply = (val : string) => {
  //   setItems(items.map(x =>{
  //     x.active = val === 'all' ? true : ( x.type === val ? true : false) 
  //     return x;
  //   }));
  //   console.log("updated items " , items);
  // };

  const filteredItems = () => {
   return items.filter(item => { 
    if (typeof item.text !== 'string') return false;
    return item.text.toLowerCase().includes(filter.toLowerCase());
   });
  }

  const isEmptyArr = () => {
   return items.every(x => x.active === false);
  }
  const filterMemo = useMemo(filteredItems , [filter , items]);
  const isEmpty = useMemo(isEmptyArr , [filter , items]);

  const getColour = (v : string) => {
    return TYPE_COLORS[v];
  }
  
  const openInVSCode = async (item : ClipboardItem) => {
    try {  
    //  await handleCopy(item.text);
     await invoke("open_vscode", { content : item.text , param1 : getFileExe(item.type) }); 
    } catch (error) {
      console.error("Error opening VS Code:", error);
    }
  };

  function getFileExe(language : string = "text") : string {
    return "index."+ (language === "python" ? "py" :
    language === "typescript" ? "ts" :  
    language === "javascript" ? "js" :  
    language === "text" ? "txt" :  language);
  } 


  return (
    <div  className="flex flex-col h-screen  bg-gradient-to-b from-gray-100 to-gray-300 dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-800
">
      {/* Fixed Header */}
      <div  className="p-4 py-3 dark:bg-gray-800">

        <section className='flex justify-between mb-2 items-center'>
          <h5 ref={element} className="font-bold flex-1">🐱 copy_cat </h5>
          <div className='flex items-center gap-2'>
            {items.length > 0 && (
              <svg onClick={handleClearAll} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            )}
            <svg onClick={callbackFn} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 hover:bg-gray-400 hover:stroke-white duration-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
        </section>
        {/* <FilterInput value={filter} onChange={setFilter} /> */}
      </div>

      {/* <div className='flex gap-2 p-4 py-2 overflow-auto' style={{scrollbarWidth : "none"}}>
          {typeFormats.map((item:string) =>(
            <div onClick={() => filterApply(item)} className='rounded-md source-theme !p-3 cursor-pointer' key={item}>
              {item}
            </div>
          ))
          }
      </div> */}

      

      {/* Scrollable Card Section */}
      <div  className="flex-1 overflow-auto p-4 pt-2 thin-scrollbar">
        <div className={`${isEmpty ? "w-full text-center mt-20" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"}`}>
          {!isEmpty ? filterMemo.map((item, index) => (

            <div key={index}  className={`group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group-hover:shadow-lg transition-shadow h-36 flex flex-col relative 
                 ${item.active ? "block" : "hidden"}`}
                  onClick={() => handleCopy(item.text) }
            >
              <div className={`flex items-center absolute gap-2 top-1 right-1 z-20`}>
                <p className={` ${getColour(item.type ?? "")} text-sm rounded-md text-white transition-all duration-100`}>{item.type}</p>
                <svg  onClick={() => openInVSCode(item)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-black dark:stroke-white min-h-full w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>


              <div className="flex-1 p-3 overflow-hidden opacity-60 hover:opacity-100 mt-6 mb-2">
                <p className="text-gray-800 line-clamp-4">{item.text}</p>
              </div>
              <div className="source-theme">
                {item.source || 'System Clipboard'}
              </div>
            </div>
          )) : 
          <>
              No items found!
          </>
        }
        </div>
      </div> 
    </div>
  );
}

export default FloatingWindow;
