import React, { createContext, useContext, useState } from "react";
import { STEPS } from "../components/Steps";

import { Bounce, toast } from "react-toastify";
import useAxios from "../Utils/useAxios";

type PhoneCase = {
	id: number;
	color: string;
	finish: string;
	material: string;
	model: string;
	price: number;
	description: string | null;
	imageId: number;
};

type UploadContextType = {
	image: { url: string; filename: string };
	setImage: React.Dispatch<
		React.SetStateAction<{ url: string; filename: string }>
	>;
	getTheUploadedImage: () => void;
	cropedImageUrl: string | null;
	setCropedImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
	phoneCase: PhoneCase | null;
	setPhoneCase: React.Dispatch<React.SetStateAction<PhoneCase | null>>;
	// currentStep: (typeof STEPS[number])
	// nextStep: () => void;
	// prevStep: () => void;
};

const UploadContextProvider = createContext<UploadContextType | undefined>(
	undefined
);

type UploadProviderProps = {
	children: React.ReactNode;
};

const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
	const api = useAxios();

	const [image, setImage] = useState<{ url: string; filename: string }>({
		url: "",
		filename: "",
	});
	const storedPhoneCase = localStorage.getItem("phoneCase");
	const [phoneCase, setPhoneCase] = useState<PhoneCase | null>(
		storedPhoneCase ? JSON.parse(storedPhoneCase) : null
	);

	const [cropedImageUrl, setCropedImageUrl] = useState<string | null>(
		localStorage.getItem("cropedImageUrl")
			? localStorage.getItem("cropedImageUrl")
			: null
	);

	const getTheUploadedImage = async () => {
		const response = await api.get("/uploads/image");
		if (response.status === 200) {
			setImage({ url: response.data.url, filename: response.data.filename });
		} else {
			toast.error("please upload the image correctly first", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: 0,
				theme: "light",
				transition: Bounce,
			});
		}
	};

	return (
		<UploadContextProvider.Provider
			value={{
				image,
				setImage,
				getTheUploadedImage,
				cropedImageUrl,
				setCropedImageUrl,
				phoneCase,
				setPhoneCase,
			}}
		>
			{children}
		</UploadContextProvider.Provider>
	);
};

export default UploadProvider;

export const useUploadContext = () => {
	const context = useContext(UploadContextProvider);

	if (context === undefined) {
		throw new Error("useUserContext must be used within a UserProvider");
	}

	return context;
};
