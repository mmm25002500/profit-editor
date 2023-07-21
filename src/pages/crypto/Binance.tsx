import React from "react";
import Head from "next/head";
import Dropdown from "@/components/CryptoPage/PageSelector";

const Binance: React.FC = () => {
  return (
    <>
      <Head>
        <title>加密貨幣獲利單編輯器</title>
      </Head>
      <div className="container mx-auto pt-8 pl-5 pr-5 transition-colors duration-100">
        <h2 className="text-2xl sm:text-3xl">Binance 永續合約獲利單編輯器</h2>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        <form>
          <div className="grid md:grid-cols-3 md:gap-6">
          <Dropdown currentExchange="Binance"></Dropdown>
          </div>
        </form>
      </div>
    </>
  );
};

export default Binance;
