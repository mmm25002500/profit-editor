import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import Head from "next/head";
import PageSelector from "@/components/CryptoPage/PageSelector";
import BasedPage, { calculator, BasedPageRef, Content } from "@/components/CryptoPage/BasedPage";
import Dropdown from "@/components/CryptoPage/PageSelector";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";

const Pionex: React.FC = () => {

  // 建立 ref
  const basedPageRef = useRef<BasedPageRef>(null);

  // 處理下載，子組件的方法傳遞上來
  const handleDownload = () => {
    basedPageRef.current?.handleDownload();
  };

  // 處理文字，子組件的方法傳遞上來
  const handleTextChange = (key: string, value: string | number | Object) => {
    basedPageRef.current?.handleTextChange(key, value);
  };

  // 千分位逗號，小數點不逗號
  const numberWithCommas = (x: number) => {
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  useEffect(() => {
    // 設定 QR Code
    handleTextChange('QrCode', { pos1: 100, pos2: 892, width: 149, height: 149 });
    // 設定手續費
    handleTextChange('fee', 0.001);
  }, []);

  // 產生 QR Code
  const generateQRCodeAddr = (invitation_code: string): string => {
    if (invitation_code)
      return "https://www.pionex.com/zh-TW/sign/ref/" + invitation_code;
    else
      return '';
  };

  // 繪製文字
  const drawWithText = (ctx: CanvasRenderingContext2D, content: Content, times: number = 1) => {

    // %數
    const percent = calculator(content.LongShort, content.times, content.position_price, content.now_price, content.IA, content.fee);
    if (percent >= 0) {
      ctx.font = `${62*times}px youhei`;
      ctx.fillStyle = "#009e64";
      ctx.textAlign = "left";
    } else {
      ctx.font = `${62*times}px youhei`;
      ctx.fillStyle = "#d03939";
      ctx.textAlign = "left";
    }

    if (Math.round(percent * 100) / 100 > 0) {
      ctx.fillText( "+"+ numberWithCommas(Math.round(percent * 100)/100).toString()+'%', 49*times, 248*times);
    } else {
      ctx.fillText(numberWithCommas(Math.round(percent * 100)/100).toString()+'%', 49*times, 248*times);
    }

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
    ctx.fillText(numberWithCommas(content.position_price).toString(), 47*times, 332*times);

    // 標記價格
    ctx.font = `${14*times}px inter`;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(numberWithCommas(content.now_price).toString(), 175*times, 332*times);

    // 持有時間
    ctx.font = `${14*times}px inter`;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    // 兩個時間之間加上空格
    if (content.position_time.includes('天') && content.position_time.includes('小時')) {
      const text = content.position_time.split('天')[0] + '天 ' + content.position_time.split('天')[1].split('小時')[0] + '小時';
      ctx.fillText(text, 303 * times, 332 * times);
    } else if (content.position_time.includes('小時') && content.position_time.includes('分')) {
      const text = content.position_time.split('小時')[0] + '小時 ' + content.position_time.split('小時')[1].split('分')[0] + '分';
      ctx.fillText(text, 303 * times, 332 * times);
    } else if (content.position_time.includes('分') && content.position_time.includes('秒')) {
      const text = content.position_time.split('分')[0] + '分 ' + content.position_time.split('分')[1].split('秒')[0] + '秒';
      ctx.fillText(text, 303 * times, 332 * times);
    } else {
      ctx.fillText(content.position_time, 303 * times, 332 * times);
    }

    // 邀請碼
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
        <BasedPage
          ref={basedPageRef}
          drawWithText={drawWithText}
          generateQRCodeAddr={generateQRCodeAddr}
          bg_img="/imgs/crypto/pionex_clear.png"
        ></BasedPage>

        <form>
          <Dropdown currentExchange="Pionex"></Dropdown>

          <div className="grid md:grid-cols-3 md:gap-6">
            {/* 輸入幣種 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" name="crypto" id="crypto" onChange={ (event ) => handleTextChange('crypto', event.target.value )} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">幣種</label>
            </div>

            {/* 輸入倍數 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="number" name="times" onChange={ (event) => handleTextChange('times', event.target.value)} id="times" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">倍數</label>
            </div>

            {/* 輸入方向 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" name="LongShort" onChange={ (event) => handleTextChange('LongShort', event.target.value)} id="LongShort" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">方向(多: L, 空: S)</label>
            </div>
          </div>

          <div className="grid md:grid-cols-3 md:gap-6">
            {/* 持倉均價 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" name="position_price"  id="position_price" onChange={ (event) => handleTextChange('position_price', event.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">持倉均價</label>
            </div>

            {/* 標記價格 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="number" name="now_price" onChange={ (event) => handleTextChange('now_price', event.target.value)} id="now_price" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">標記價格</label>
            </div>

            {/* 倉位價值 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="number" name="IA" onChange={ (event) => handleTextChange('IA', event.target.value)} id="IA" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">倉位價值</label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 md:gap-6">
            {/* 持有時間 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" onChange={ (event) => handleTextChange('position_time', event.target.value)} name="position_time" id="position_time" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">持有時間</label>
            </div>

            {/* 輸入邀請碼 */}
            <div className="relative z-0 w-full mb-6 group">
                <input type="text" name="invitation_code" id="invitation_code" onChange={ (event) => handleTextChange('invitation_code', event.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">邀請碼</label>
            </div>

          </div>
          <button onClick={handleDownload} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">下載圖片</button>
        </form>
      </div>
    </>
  );
};

export default Pionex;
