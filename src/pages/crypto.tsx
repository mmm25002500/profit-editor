import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import Head from "next/head";

const content_data = {
  position_price: 0,
  now_price: 0,
  position_time: '',
  invitation_code: '',
  LongShort: '',
  times: 0,
  crypto: ''
};
const CryptoPage: React.FC = () => {
  const [content, setContent] = useState(content_data); // 用於存儲使用者輸入的文字
  const [imageLoaded, setImageLoaded] = useState(false); // 用於標記圖片是否加載完成
  const canvasRef = useRef<HTMLCanvasElement>(null); // 用於獲取 canvas 元素的參考
  const imageRef = useRef<HTMLImageElement>(null); // 用於獲取圖片的參考

  // 初始化圖片，載入圖片。
  useEffect(() => {
    const image = new Image();
    image.src = "/imgs/crypto/pionex_clear.png";
    image.onload = () => {
      setImageLoaded(true);
    };
  }, []);

  // 當圖片已載入，或 context 值改變的時候，預覽就改變。
  useEffect(() => {
    preview();
  }, [imageLoaded, content]);

  // 處理使用者輸入文字的函數
  const handleTextChange = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setContent({...content, [key]: event.target.value});
  };

  // 處理下載圖片的函數
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (imageLoaded && canvas) {
      const image = imageRef.current!;
      canvas.width = image.width /2;
      canvas.height = image.height /2;

      // 繪製圖片
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

      // 增加文字
      if (ctx) {
        drawWithText(ctx);
      }

      // 使用 canvas.toDataURL() 將 canvas 轉換為 base64 格式的圖片數據
      const imgData = canvas.toDataURL();

      // 使用 file-saver 將圖片數據保存為圖片文件
      saveAs(imgData, "modified_image.png");
    }
  };

  // 繪製圖片並加入文字
  const preview = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (imageLoaded && canvas) {
      const image = imageRef.current!;
      canvas.width = image.width /2;
      canvas.height = image.height /2;

      // 繪製圖片
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

      // 增加文字
      if (ctx) {
        drawWithText(ctx);
      }
    }
  };

  // 繪製文字
  const drawWithText = (ctx: CanvasRenderingContext2D) => {
    // %數
    
    const percent = calculator(content.LongShort, content.times, content.position_price, content.now_price);
    if (percent >= 0) {
      ctx.font = "62px youhei";
      ctx.fillStyle = "#009e64";
      ctx.textAlign = "left";
    } else {
      ctx.font = "62px youhei";
      ctx.fillStyle = "#d03939";
      ctx.textAlign = "left";
    }
    ctx.fillText((Math.round(percent * 100)/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'%', 49, 248);

    // 幣種
    ctx.font = "bold 18px inter";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.crypto + ' 永續合約', 140, 160);
    
    // 倍數
    ctx.font = "bold 18px inter";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.times.toString()+'x', 95, 160);

    // 方向
    if (content.LongShort === 'L') {
      ctx.font = "18px inter";
      ctx.fillStyle = "#009e64";
      ctx.textAlign = "left";
      ctx.fillText('多倉', 47, 160);
    } else if (content.LongShort === 'S'){
      ctx.font = "18px inter";
      ctx.fillStyle = "#d03939";
      ctx.textAlign = "left";
      ctx.fillText('空倉', 47, 160);
    }


    // 持倉均價
    ctx.font = "14px inter";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.position_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), 47, 332);

    // 標記價格
    ctx.font = "14px inter";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.now_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), 175, 332);

    // 持有時間
    ctx.font = "14px inter";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.position_time, 303, 332);

    // 持有時間
    ctx.font = "bold 25px inter";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(content.invitation_code, 143, 504);
  }

  const calculator = (LongShort: string, multiple: number, position_price: number, now_price: number): number => {
    if (LongShort === 'L') {
      return (now_price - position_price) / position_price * 100 * multiple;
    } else if (LongShort === 'S') {
      return (position_price - now_price) / position_price * 100 * multiple;
    } else { 
      return 0;
    }
  }

  return (
    <>
      <Head>
        <title>加密貨幣獲利單編輯器</title>
      </Head>
      <div>
        {/* 顯示圖片 */}
        <img
          ref={imageRef}
          src="/imgs/crypto/pionex_clear.png"
          alt="Image with Text"
          style={{ display: "none" }}
        />

        {/* Canvas 元素 */}
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid black" }}
        />

        {/* 輸入框，讓使用者輸入幣種 */}
        <input
          type="text"
          onChange={ (event) => handleTextChange('crypto', event)}
          className="bloblock block p-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500ck"
          placeholder="請輸入幣種"
        />

        {/* 輸入框，讓使用者輸入倍數 */}
        <input
          type="number"
          onChange={ (event) => handleTextChange('times', event)}
          className="bloblock block p-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500ck"
          placeholder="請輸入倍數"
        />

        {/* 輸入框，讓使用者輸入方向 */}
        <input
          type="text"
          onChange={ (event) => handleTextChange('LongShort', event)}
          className="bloblock block p-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500ck"
          placeholder="請輸入方向(多: L, 空: S))"
        />

        {/* 輸入框，讓使用者輸入持倉均價 */}
        <input
          type="number"
          onChange={ (event) => handleTextChange('position_price', event)}
          className="bloblock block p-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500ck"
          placeholder="請輸入持倉均價"
        />

        {/* 輸入框，讓使用者輸入標記價格 */}
        <input
          type="number"
          onChange={ (event) => handleTextChange('now_price', event)}
          className="bloblock block p-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500ck"
          placeholder="請輸入標記價格"
        />

        {/* 輸入框，讓使用者輸入持有時間 */}
        <input
          type="text"
          onChange={ (event) => handleTextChange('position_time', event)}
          className="bloblock block p-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500ck"
          placeholder="請輸入持有時間"
        />

        {/* 輸入框，讓使用者輸入邀請碼 */}
        <input
          type="text"
          onChange={ (event) => handleTextChange('invitation_code', event)}
          className="bloblock block p-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500ck"
          placeholder="請輸入邀請碼"
        />

        {/* 輸入框，讓使用者輸入請上傳QR Code */}
        <input
          type="text"
          onChange={ (event) => handleTextChange('df', event)}
          className="bloblock block p-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500ck"
          placeholder="請上傳QR Code"
        />

        {/* 下載按鈕 */}
        <button onClick={handleDownload} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">下載圖片</button>
      </div>
    </>
  );
};

export default CryptoPage;
