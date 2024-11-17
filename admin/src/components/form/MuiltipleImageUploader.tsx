import { useState } from 'react';
import { uploadImage } from '../../api/upload/uploadImage';
import { Button, Flex, notification, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../hook/hook';
import {
  addDescriptionImages,
  removeAllDescriptionImages,
  removeDescriptionImages,
} from '../../store/image/imageSlice';
import { TBookImage } from '../../types/book';
import { validateFile } from '../../utils/validateFile';
import { NotificationType } from '../../types/type';

const MultipleImageUploader = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType, msg: string) => {
    api[type]({
      message: 'Tải ảnh thất bại',
      description: msg,
    });
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    const validateResult = validateFile(file);
    if (!validateResult.isValid) {
      openNotificationWithIcon('error', validateResult.message);
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      `${import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}`
    );
    console.log(formData.get('file'));
    try {
      setIsLoading(true);
      const response = await uploadImage(file);
      if (response.url) {
        dispatch(
          addDescriptionImages({
            imageUrl: response.url,
          })
        );
        setImageUrls((prev) => [...prev, response.url ? response.url : '']);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      handleUpload(event.target.files[0]);
    }
  };

  const triggerUpload = () => {
    const uploadInput = document.getElementById('upload-input-multiple');
    uploadInput?.click();
  };

  const removeImage = (targetItem: TBookImage) => {
    const newUrls = imageUrls.filter((url) => url !== targetItem.imageUrl);
    dispatch(removeDescriptionImages(targetItem));
    setImageUrls(newUrls);
  };

  const removeAllImage = () => {
    dispatch(removeAllDescriptionImages());
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={isLoading} tip='Đang tải'>
        <Flex gap={32} wrap className='ml-4'>
          <input
            id='upload-input-multiple'
            className='!hidden'
            type='file'
            accept='image/*'
            onChange={(e) => handleFileChange(e)}
          />
          <Flex
            onClick={triggerUpload}
            vertical
            align='center'
            justify='center'
            className='size-32 border-2 border-dashed cursor-pointer'
          >
            <PlusOutlined />
            <p>Tải ảnh lên</p>
          </Flex>
          {imageUrls.map((url) => (
            <div className='relative'>
              <img className='size-32' src={url} />
              <span
                className='size-6 text-white bg-soft-red rounded-full absolute top-[-4px] left-28 cursor-pointer'
                onClick={() =>
                  removeImage({
                    imageUrl: url,
                  })
                }
              >
                X
              </span>
            </div>
          ))}
        </Flex>
        <Button onClick={removeAllImage} type='primary'>
          Xóa tất cả
        </Button>
      </Spin>
    </>
  );
};

export default MultipleImageUploader;
