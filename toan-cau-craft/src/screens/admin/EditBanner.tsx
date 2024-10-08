import { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody, Button, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { Banner, fetchBanner, handleUploadImage, updateBanner } from "@/models/Banner";
import ModalCommon from "@/components/Modals/ModalCommon";
import Lottie from "react-lottie";
import { LottieApp } from "@/utils/lotties";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EditBanner() {
    const router = useRouter();
    const responseModal = useDisclosure();
    const [images, setImages] = useState({
        home: '',
        product: '',
        contact_us: '',
        about_us: '',
    });
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({
        home: null,
        product: null,
        contact: null,
        about: null,
    });
    const [activeTab, setActiveTab] = useState("home");
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>();
    const [isSuccess, setIsSuccess] = useState<boolean>(true);

    const tabs = [
        {
            id: "home",
            label: "Banner Trang Chủ",
            content: "Photo content",
        },
        {
            id: "product",
            label: "Banner Sản Phẩm",
            content: "Music content",
        },
        {
            id: "contact_us",
            label: "Banner Contact Us",
            content: "Video content",
        },
        {
            id: "about_us",
            label: "Banner About Us",
            content: "Video content",
        },
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const { name } = e.target;
            setActiveTab(name);
            const file = e.target.files[0];

            // Update selected file for the active tab
            setSelectedFiles((prev) => ({ ...prev, [name]: file }));

            // Create image preview
            const imageURL = URL.createObjectURL(file);
            setImages((prev) => ({ ...prev, [name]: imageURL }));
        }
    };

    const getAllBanners = async () => {
        const data = await fetchBanner();
        setBanners(data);
        setImages({
            home: data.find(item => item.type === 'home')?.url || '',
            about_us: data.find(item => item.type === 'about_us')?.url || '',
            contact_us: data.find(item => item.type === 'contact_us')?.url || '',
            product: data.find(item => item.type === 'product')?.url || '',
        });
    };

    const handleUpload = async () => {
        const selectedFile = selectedFiles[activeTab]; // Get selected file for the active tab

        if (selectedFile) {
            responseModal.onOpen();
            setIsLoading(true);
            setResponseMessage("Đang tải ảnh lên bộ nhớ đám mây");
            const imagesUpload = await handleUploadImage({
                image: selectedFile,
                name: selectedFile.name || ''
            });
            setResponseMessage("Đang cập nhật dữ liệu mới");
            const bannerId = banners.find(banner => banner.type === activeTab)?.id || '';
            updateBanner({
                bannerId,
                bannner: {
                    type: activeTab,
                    url: imagesUpload
                }
            }).then((data) => {
                if (data.data) {
                    setIsLoading(false);
                    setSelectedFiles({});
                    setResponseMessage("Cập nhật thành công");
                    setTimeout(() => {
                        responseModal.onClose();
                    }, 2000);
                } else if (data.error) {
                    if ((data.error as any).code === "permission-denied") {
                        toast.error('Bạn không có quyền truy cập!')
                        router.push('/admin/login')
                    } else {
                        setResponseMessage("Có lỗi xảy ra: \n" + data.error);
                    }
                }

            })
        }
    };

    useEffect(() => {
        getAllBanners();
    }, []);

    const resetState = () => {
        setIsLoading(false);
        setResponseMessage("Vui lòng đợi...");
    };


    return (
        <div className="flex w-full flex-col justify-center items-center pt-10 px-10">
            <Tabs aria-label="Dynamic tabs" items={tabs} >
                {(item) => (
                    <Tab key={item.id} title={item.label}>
                        <Card>
                            <CardBody className="relative">
                                <Image
                                    src={images[item.id as keyof typeof images]}
                                    alt="Banner"
                                    className="cursor-pointer"
                                    onClick={() => document.getElementById(`upload-${item.id}`)?.click()}
                                    width={500}
                                    height={300}
                                />
                                <input
                                    type="file"
                                    id={`upload-${item.id}`}
                                    className="hidden"
                                    name={item.id}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </CardBody>
                        </Card>
                        <div className="mt-4">
                            {selectedFiles[item.id] && (
                                <Button
                                    color="primary"
                                    onClick={handleUpload}
                                >
                                    Xác nhận thay đổi banner
                                </Button>
                            )}
                        </div>
                    </Tab>
                )}
            </Tabs>
            <ModalCommon onCloseModal={resetState} disclosure={responseModal}>
                <p className="text-textPrimary text-xl my-5">{responseMessage}</p>
                {isLoading ? (
                    <Lottie
                        style={{ width: 100, height: 100 }}
                        options={{
                            loop: true,
                            autoplay: true,
                            animationData: LottieApp.Loading,
                            rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice",
                            },
                        }}
                        isClickToPauseDisabled={true}
                        width={"100%"}
                    />
                ) : isSuccess ? (
                    <Lottie
                        style={{ width: 100, height: 100 }}
                        options={{
                            loop: true,
                            autoplay: true,
                            animationData: LottieApp.Success,
                            rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice",
                            },
                        }}
                        isClickToPauseDisabled={true}
                        width={"100%"}
                    />
                ) : (
                    <Lottie
                        style={{ width: 100, height: 100 }}
                        options={{
                            loop: true,
                            autoplay: true,
                            animationData: LottieApp.Error,
                            rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice",
                            },
                        }}
                        isClickToPauseDisabled={true}
                        width={"100%"}
                    />
                )}
            </ModalCommon>
        </div>
    );
}
