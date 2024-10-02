import 'react-toastify/dist/ReactToastify.css';
import MaxWidthWrapper from '../../components/MaxWidthWrapper'
import Steps from '../../components/Steps'
import useAxios from '../../Utils/useAxios'
import { useEffect, useState } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import * as AspectRatioPeremitive from '@radix-ui/react-aspect-ratio'
import { Rnd } from 'react-rnd';
import HandleComponent from '../../components/HandleComponent';
import {ScrollArea} from '../../components/scroll-area'
import { RadioGroup } from '@headlessui/react'
import { COLORS } from '../../Utils/COLORS'

const Design = () => {

    const AspectRatio = AspectRatioPeremitive.Root
    const api = useAxios()
    const [image, setImage] = useState<string>('')
    const [options, setOptions] = useState<{color: (typeof COLORS)[number]}>({
        color: COLORS[0],
    })
    
    const getTheUploadedImage = async() => {
        const response = await api.get("/uploads/image")
        if(response.status === 200){
            setImage(response.data.url)
        }else{
            toast.error('please upload the image correctly first', {
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
        
    }

    useEffect(()=> {
        getTheUploadedImage()
    }, [])

  return (
    <MaxWidthWrapper>
        <ToastContainer/>
        <Steps />
        <div className='relative mb-20 grid grid-cols-3 mt-20 pb-20'>
            <div className='relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
                <div className='relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]'>
                    <AspectRatio
                        ratio={896 / 1831}
                        className='pointer-events-none relative z-40 aspect-[896/1831] w-full'>
                        <img
                            alt='phone image'
                            src='/phone-template.png'
                            className='pointer-events-none z-40 select-none'
                        />
                    </AspectRatio>
                    <div className='absolute z-30 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]' />
                    <div
                        className={`absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] bg-${options.color.tw}`}
                    />
                </div>
                <Rnd 
                    lockAspectRatio
                    className='absolute z-20 border-[3px] border-primary'
                    resizeHandleComponent={{
                        bottomRight: <HandleComponent />,
                        bottomLeft: <HandleComponent />,
                        topRight: <HandleComponent />,
                        topLeft: <HandleComponent />
                    }}>
                    <div className='relative w-full h-full'>
                        <img src={image} alt="uploaded image" className='pointer-events-none h-full w-full object-cover' />
                    </div>
                </Rnd>
            </div>
            <div className='h-[37.5rem] flex flex-col bg-white'>
                <ScrollArea className='relative flex-1 overflow-auto'>
                    <div area-hidden="true" className='absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none'/>
                    <div className='px-8 pb-12 pt-8'>
                        <h2 className='tracking-tight front-bold text-xl'>Customize your phone case</h2>
                        <div className='w-full h-px bg-zinc-200 my-6'/>
                        <div className='relative mt-4 h-full flex flex-col justify-between'>
                            <RadioGroup value={options.color} onChange={(val) => setOptions((prevOptions) => ({...prevOptions, color:val}))}>
                                <RadioGroup.Label className='text-sm font-bold text-zinc-500'>{`Color: ${options.color.label}`}</RadioGroup.Label>
                                <div className='mt-3 flex items-center space-x-3'>
                                    {COLORS.map((color) => (
                                        <RadioGroup.Option key={color.label} value={color} className={({active, checked}) => `raltive -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent ${checked || active ? 'border-'+ color.tw : null}`}>
                                            <span className={`bg-${color.tw} w-8 h-8 rounded-full border-${options.color.tw} border-opacity-10`}/>
                                        </RadioGroup.Option>
                                    ))}
                                </div>
                            </RadioGroup>
                            <div className='relative flex flex-col gap-3 w-full'>
                                
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    </MaxWidthWrapper>
    
  )
}

export default Design