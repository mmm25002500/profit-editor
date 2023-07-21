import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import Head from "next/head";
import PageSelector from "@/components/CryptoPage/PageSelector";
import BasedPage, { calculator, BasedPageRef, Content } from "@/components/CryptoPage/BasedPage";
import Dropdown from "@/components/CryptoPage/PageSelector";

const content_data = {
  position_price: 0,
  now_price: 0,
  position_time: '',
  invitation_code: '',
  LongShort: '',
  times: 0,
  crypto: ''
};

const Pionex: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false); // 用於標記圖片是否加載完成
  const canvasRef = useRef<HTMLCanvasElement>(null); // 用於獲取 canvas 元素的參考
  const imageRef = useRef<HTMLImageElement>(null); // 用於獲取圖片的參考

  // Create a ref using useRef
  const basedPageRef = useRef<BasedPageRef>(null);

  // 初始化圖片，載入圖片。
  useEffect(() => {
    const image = new Image();
    image.src = "/imgs/crypto/pionex_clear.png";
    image.onload = () => {
      setImageLoaded(true);
    };
  }, []);


  // Parent component's handleDownload function
  const handleDownload = () => {
    basedPageRef.current?.handleDownload();
  };

  // Parent component's handleTextChange function
  const handleTextChange = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    basedPageRef.current?.handleTextChange(key, event);
  };

  // 繪製文字
  const drawWithText = (ctx: CanvasRenderingContext2D, content: Content, times: number=1) => {
    // %數
    const percent = calculator(content.LongShort, content.times, content.position_price, content.now_price);
    if (percent >= 0) {
      ctx.font = `${62*times}px youhei`;
      ctx.fillStyle = "#009e64";
      ctx.textAlign = "left";
    } else {
      ctx.font = `${62*times}px youhei`;
      ctx.fillStyle = "#d03939";
      ctx.textAlign = "left";
    }
    ctx.fillText((Math.round(percent * 100)/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'%', 49*times, 248*times);

    // 幣種
    ctx.font = `bold ${18*times}px inter`;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.crypto + ' 永續合約', 140*times, 160*times);
    
    // 倍數
    ctx.font = `bold ${18*times}px inter`;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.times.toString()+'x', 95*times, 160*times);

    // 方向
    if (content.LongShort === 'L') {
      ctx.font = `${18*times}px inter`;
      ctx.fillStyle = "#009e64";
      ctx.textAlign = "left";
      ctx.fillText('多倉', 47*times, 160*times);
    } else if (content.LongShort === 'S'){
      ctx.font = `${18*times}px inter`;
      ctx.fillStyle = "#d03939";
      ctx.textAlign = "left";
      ctx.fillText('空倉', 47*times, 160*times);
    }


    // 持倉均價
    ctx.font = `${14*times}px inter`;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.position_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), 47*times, 332*times);

    // 標記價格
    ctx.font = `${14*times}px inter`;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.now_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), 175*times, 332*times);

    // 持有時間
    ctx.font = `${14*times}px inter`;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.position_time, 303*times, 332*times);

    // 持有時間
    ctx.font = `bold ${25*times}px inter`;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.invitation_code, 143*times, 504*times);
  }

  return (
    <>
      <Head>
        <title>Pionex 獲利單編輯器</title>
      </Head>
      <div className="container mx-auto pt-8 pl-5 pr-5 transition-colors duration-100">
        {/* 顯示圖片 */}
        <h2 className="text-2xl sm:text-3xl">Pionex 永續合約獲利單編輯器</h2>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        <BasedPage ref={basedPageRef} drawWithText={drawWithText}></BasedPage>

        <form>
          <Dropdown currentExchange="Pionex"></Dropdown>

          <div className="grid md:grid-cols-3 md:gap-6">
            {/* 輸入幣種 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" name="crypto" id="crypto" onChange={ (event) => handleTextChange('crypto', event)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">幣種</label>
            </div>

            {/* 輸入倍數 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="number" name="times" onChange={ (event) => handleTextChange('times', event)} id="times" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">倍數</label>
            </div>

            {/* 輸入方向 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" name="LongShort" onChange={ (event) => handleTextChange('LongShort', event)} id="LongShort" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">方向(多: L, 空: S)</label>
            </div>
          </div>

          <div className="grid md:grid-cols-3 md:gap-6">       
            {/* 輸入持倉均價 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" name="now_price"  id="now_price" onChange={ (event) => handleTextChange('now_price', event)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">持倉均價</label>
            </div>

            {/* 標記價格 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="number" name="now_price" onChange={ (event) => handleTextChange('now_price', event)} id="now_price" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">標記價格</label>
            </div>

            {/* 持有時間 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" onChange={ (event) => handleTextChange('position_time', event)} name="position_time" id="position_time" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">持有時間</label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 md:gap-6">
            {/* 輸入邀請碼 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" name="invitation_code" id="invitation_code" onChange={ (event) => handleTextChange('invitation_code', event)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">邀請碼</label>
            </div>

            {/* 上傳QR Code */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" name="invitation_code" id="invitation_code" onChange={ (event) => handleTextChange('df', event)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">上傳QR Code</label>
            </div>
          </div>
          <button onClick={handleDownload} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">下載圖片</button>
        </form>
      </div>
    </>
  );
};

export default Pionex;
