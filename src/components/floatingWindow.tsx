import { useState, useEffect, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import "./App.css";
import { AVAILABLE_TYPE_FORMATS, matchPattern, TYPE_COLORS } from '../json/FORMAT_TYPE';
import FilterInput from './FilterInput';

interface ClipboardItem {
  text: string;
  source: string;
  type ?: string,
  active?:boolean
}

const STORAGE_KEY = 'clipboard-history';

function FloatingWindow() {

  
  const [items, setItems] = useState<ClipboardItem[]>(() => { 
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('');
  const [typeFormats] = useState(AVAILABLE_TYPE_FORMATS);

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

  // const handleCopy = async (data: any) => {
  //   console.log(data);
    
    // await openInVSCode(data);
    // try {
    //   await invoke('set_clipboard_text', { text });
    //   toast.success('Copied to clipboard!');
    // } catch (error) {
    //   console.error('Failed to copy:', error);
    //   toast.error('Failed to copy');
    // }
  // };

  const handleClearAll = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('History cleared');
  };

  const filterApply = (val : string) => {
    setItems(items.map(x =>{
      x.active = val === 'all' ? true : ( x.type === val ? true : false) 
      return x;
    }));
    console.log("updated items " , items);
  };

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
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800">

        <section className='flex justify-between mb-4'>
          <h1 className="text-2xl font-bold mb-4">Copy Cat 🐱</h1>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 bg-red-500/50 text-white h-[40px] rounded hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </section>
        <FilterInput value={filter} onChange={setFilter} />
      </div>

      <div className='flex gap-2 p-6 flex-wrap'>
          {typeFormats.map((item:string) =>(
            <div onClick={() => filterApply(item)} className='border-re source-theme !p-3 active:bg-red-300 active:text-white' key={item}>
              {item}
            </div>
          ))
          }
      </div>

      {/* Scrollable Card Section */}
      <div className="flex-1 overflow-auto p-6 pt-2">
        <div className={`${isEmpty ? "w-full text-center mt-60" : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"}`}>
          {!isEmpty ? filterMemo.map((item, index) => (
            <div key={index}  className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-36 flex flex-col relative 
                 ${item.active ? "block" : "hidden"}`}
              onClick={() => openInVSCode(item)}
            >
              <div className={` ${getColour(item.type ?? "")} source-theme rounded-md absolute top-1 right-1 z-20  `}>
                {item.type}
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

      {/* Fixed Footer */}
      

      <Toaster position="bottom-right" />
    </div>
  );
}

export default FloatingWindow;
