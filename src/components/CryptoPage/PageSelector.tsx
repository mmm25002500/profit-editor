import Link from "next/link";
import Dropdown from "../Dropdown";
import { useRouter } from "next/navigation";

interface Props {
  currentExchange: string;
}

const exchanges = [
  {
    name: 'Pionex',
    url: '/crypto/Pionex'
  },
  {
    name: "Binance",
    url: "/crypto/Binance",
  },
  {
    name: 'Bybit',
    url: '/crypto/Bybit'
  },
  {
    name: 'BingX',
    url: '/crypto/BingX'
  },
  {
    name: "OKX",
    url: "/crypto/OKX",
  },
  {
    name: 'Bitget',
    url: '/crypto/Bitget'
  },
  {
    name: "Huobi",
    url: "/crypto/Houbi",
  },
]

const PageSelector = ({ currentExchange }: Props) => {
  const router = useRouter();

  return (
    <div>
      {/* 選擇交易所 */}
      <Dropdown buttonText={currentExchange}>
        {exchanges.map((item) => (
          <li key={item.name}>
            <button
              type="button"
              disabled={item.name === currentExchange}
              onClick={() => router.push(item.url)}
              className="block w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white disabled:dark:bg-gray-800"
            >
              {item.name}
            </button>
          </li>
        ))}
      </Dropdown>
    </div>
  );
}

export default PageSelector;