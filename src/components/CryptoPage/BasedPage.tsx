import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, ChangeEvent } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import QRCode from "react-qr-code";

const content_data = {
  position_price: 0,
  now_price: 0,
  position_time: '',
  invitation_code: '',
  LongShort: '',
  times: 0,
  crypto: '',
  IA: 0,
  fee: 0.0001,
	QrCode: {
		pos1: 0,
		pos2: 0,
		width: 0,
		height: 0,
	}
};

interface Props {
	drawWithText: any;
	generateQRCodeAddr: any;
	bg_img: string;
}

export interface Content {
	position_price: number;
	now_price: number;
	position_time: string;
	invitation_code: string;
	LongShort: string;
	times: number;
  crypto: string;
  IA: number;
  fee: number;
	QrCode: {
		pos1: number;
		pos2: number;
		width: number;
		height: number;
	}
}

export interface BasedPageRef {
	handleDownload: () => void;
	handleTextChange: (key: string, event: string | number | Object) => void;
}

const BasedPage = forwardRef((props: Props, ref) => {
  const [content, setContent] = useState(content_data); // 用於存儲使用者輸入的文字
	const [imageLoaded, setImageLoaded] = useState(false); // 用於標記圖片是否加載完成
	const canvasRef = useRef<HTMLCanvasElement>(null); // 用於獲取 canvas 元素的參考
	const imageRef = useRef<HTMLImageElement>(null); // 用於獲取圖片的參考
	const [invitation_addr, setInvitationAddr] = useState(''); // 用於標記圖片是否加載完成
	// 初始化圖片，載入圖片。
	useEffect(() => {
		const image = new Image();
		image.src = props.bg_img;
		image.onload = () => {
			setImageLoaded(true);
		};
	}, []);

	// 當圖片已載入，或 context 值改變的時候，預覽就改變。
	useEffect(() => {
		setInvitationAddr(props.generateQRCodeAddr(content.invitation_code));
		preview();
	}, [imageLoaded, content]);

	// 處理下載圖片的函數
	const handleDownload = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (imageLoaded && canvas) {
			const image = imageRef.current!;
			canvas.width = image.width;
			canvas.height = image.height;

			// 繪製圖片
			ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
			// ctx?.canvas.width = 0;
			// ctx?.canvas.height = 0;

			// 繪製 QR Code;
			const img = new Image();
			const svg = document.getElementById("QRCode");
			if (svg) {
				const svgData = svg.outerHTML;
				img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
			}
			img.onload = () => {
				ctx?.drawImage(img, 500, 500, 500, 500);
			};

			// 增加文字
			if (ctx) {
				props.drawWithText(ctx, content, 2);
			}

			// 使用 canvas.toDataURL() 將 canvas 轉換為 base64 格式的圖片數據
			const imgData = canvas.toDataURL();

			// 使用 file-saver 將圖片數據保存為圖片文件
			saveAs(imgData, "modified_image.png");
			console.log("下載圖片");
		}
	};

	const handleTextChange = (key: string, value: string | number | Object) => {
		setContent({ ...content, [key]: value });
  };

	// 使用 useImperativeHandle 設置 handleDownload 函數以便透過 ref 呼叫
	useImperativeHandle(ref, () => ({
		handleDownload: handleDownload, // 將 handleDownload 函數暴露給父層
		handleTextChange: handleTextChange, // 將 handleTextChange 函數暴露給父層
	}));

	// 繪製圖片並加入文字
	const preview = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (imageLoaded && canvas) {
			const image = imageRef.current!;
			canvas.width = image.width;
			canvas.height = image.height;

			// 繪製圖片
			ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

			// 增加文字
			if (ctx) {
				props.drawWithText(ctx, content, 2);
			}
		}

		// 繪製 QR Code;
		const img = new Image();
		const svg = document.getElementById("QRCode");
		if (svg) {
			const svgData = svg.outerHTML;
			img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
		}
		img.onload = () => {
			ctx?.drawImage(img, content.QrCode.pos1, content.QrCode.pos2, content.QrCode.width, content.QrCode.height);
		};
	};

	return (
		<>
			{
				invitation_addr ? (
					<QRCode
						id="QRCode"
						value={invitation_addr}
						className="hidden"
					/>
				): (
						<></>
				)
			}
			<img
				ref={imageRef}
				src={ props.bg_img }
				alt="Image with Text"
				style={{ display: "none" }}
			/>
			{/* Canvas 元素 */}
			<canvas
				ref={canvasRef}
				style={{ border: "1px solid black" }}
				className="w-64 sm:w-72 md:w-80 m-auto"
			/>
		</>
	)

});

BasedPage.displayName = "BasedPage";

export default BasedPage;

export const calculator = (LongShort: string, multiple: number, position_price: number, now_price: number, IA: number, fee: number): number => {
	if (LongShort === 'L') {
		return (now_price - position_price) * multiple * IA * (1-fee) / position_price;
	} else if (LongShort === 'S') {
		return (position_price - now_price) * multiple * IA * (1-fee) / now_price;
	} else {
		return 0;
	}
}

