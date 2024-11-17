import { PlusOutlined } from '@ant-design/icons';
import { Flex, notification, Spin } from 'antd';
import { useState } from 'react';
import { uploadImage } from '../../api/upload/uploadImage';
import { useAppDispatch } from '../../hook/hook';
import { setThumbnailUrl } from '../../store/image/imageSlice';
import { validateFile } from '../../utils/validateFile';
import { NotificationType } from '../../types/type';

const SingleImageUploader = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
        dispatch(setThumbnailUrl(response.url));
        setImageUrl(response.url);
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
    const uploadInput = document.getElementById('upload-input-single');
    uploadInput?.click();
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={isLoading} tip='Đang tải'>
        <div className='ml-4'>
          {imageUrl !== null ? (
            <div className='relative'>
              <img className='size-32' src={imageUrl} />
              <span
                className='size-6 text-white bg-soft-red rounded-full absolute top-[-4px] left-28 cursor-pointer'
                onClick={() => {
                  dispatch(setThumbnailUrl(''));
                  setImageUrl(null);
                }}
              >
                X
              </span>
            </div>
          ) : (
            <>
              <input
                id='upload-input-single'
                className='!hidden'
                accept='image/*'
                type='file'
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
            </>
          )}
        </div>
      </Spin>
    </>
  );
};

export default SingleImageUploader;
