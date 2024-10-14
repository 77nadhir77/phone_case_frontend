import Dropzone, { FileRejection } from "react-dropzone";
import { CiImageOn } from "react-icons/ci";
import { LuLoader2 } from "react-icons/lu";
import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import { useState, useTransition } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import useAxios from "../../Utils/useAxios";
import { Bounce, toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Steps from "../../components/Steps";

export default function Upload() {
	const navigate = useNavigate();

	const api = useAxios();

	const [isDragOver, setIsDragOver] = useState<boolean>(false);
	const [uploadProgress, setUploadProgress] = useState<number>(0);

	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [isPending, startTransition] = useTransition();

	const handleUpload = async (file: File) => {
		const formData = new FormData();
		formData.append("image", file);
		try {
			setIsUploading(true);
			await api.post("/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data", // Important to set this for file uploads
				},
				onUploadProgress: (progressEvent) => {
					// Update upload progress
					if (progressEvent && progressEvent.loaded && progressEvent.total) {
						const progress = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						setUploadProgress(progress);
					} else {
						console.warn("progressEvent is undefined or missing properties.");
					}
				},
			});

			startTransition(() => {
				navigate(`/configure/design`);
			});
		} catch (error) {
			console.error("Error uploading file:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const onDragAccepted = async (acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			await handleUpload(acceptedFiles[0]);
			setIsDragOver(false);
		}
	};

	const onDragRejected = (fileRejections: FileRejection[]) => {
		const { file } = fileRejections[0];
		setIsDragOver(false);

		if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
			toast.error("Invalid file type. Only JPEG, PNG, and JPG are supported.", {
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
		} else {
			toast.error(`Upload failed! please try again`, {
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
		<MaxWidthWrapper className="flex flex-1 flex-col mt-2 mb-2 items-center">
			<ToastContainer className="w-full" />
			<Steps />
			<div
				className={`flex flex-grow flex-1 ${
					isDragOver ? "bg-blue-900/10" : "bg-gray-900/5"
				} items-center justify-center w-2/3 p-2 rounded-xl`}
			>
				<Dropzone
					onDropAccepted={onDragAccepted}
					onDropRejected={onDragRejected}
					onDragEnter={() => setIsDragOver(true)}
					onDragLeave={() => setIsDragOver(false)}
					accept={{
						"image/jpeg": [".jpeg"],
						"image/png": [".png"],
						"image/jpg": [".jpg"],
					}}
					disabled={isUploading || isPending}
				>
					{({ getRootProps, getInputProps }) => (
						<div
							className="relative w-full max-w-lg flex h-full flex-col items-center justify-center"
							{...getRootProps()}
						>
							<input {...getInputProps()} />

							{isDragOver ? (
								<AiOutlineUpload className="w-6 h-6 text-zinc-500 mb-2" />
							) : isUploading || isPending ? (
								<LuLoader2 className="animate-spin w-6 h-6 text-zinc-500 mb-2" />
							) : (
								<CiImageOn className="w-6 h-6 text-zinc-500 mb-2" />
							)}
							<div className="flex flex-col mb-2 justify-center text-sm text-zinc-700">
								{isUploading ? (
									<div className="flex flex-col items-center">
										<p>Uploading...</p>
										<progress
											className="mt-2 w-40 h-2 bg-gray-300"
											value={uploadProgress}
											max={100}
										/>
									</div>
								) : isPending ? (
									<div className="flex flex-col items-center">
										<p>Redirecting, please wait...</p>
									</div>
								) : isDragOver ? (
									<p>
										<span className="font-semibold">Drop file</span> to upload
									</p>
								) : (
									<p>
										<span className="font-semibold">Click to upload</span> or
										drag and drop
									</p>
								)}
								{isPending ? null : (
									<p className="text-xs text-zinc-500">JPEG, JPG, PNG</p>
								)}
							</div>
						</div>
					)}
				</Dropzone>
			</div>
		</MaxWidthWrapper>
	);
}
