import { Button, message, Upload, UploadFile, UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMutation } from 'react-query';

const { Dragger } = Upload;

export function UploaderPoc({
  onUploadSuccess,
  url,
}: {
  onUploadSuccess: (data: { uuid: string }) => unknown;
  url: string;
}) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { mutate: uploadFile, isLoading } = useMutation<unknown, unknown, void>(
    async () => {
      const files = fileList;
      if (files) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append(file.name, file as unknown as Blob);
        });
        const response = await fetch(url, {
          body: formData,
          method: 'POST',
        });
        onUploadSuccess(await response.json());
      }
    },
  );

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    // action: "http://localhost:5000/upload",
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (_, fileListProp) => {
      setFileList([...fileList, ...fileListProp]);

      return false;
    },
    fileList,
  };

  return (
    <div>
      <Dragger {...props} data-testid={'file-uploader'}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>
          Click or drag file to this area to upload
        </p>
        <p className='ant-upload-hint'>
          Supported file types are text only at the moment. We can easily add
          support for powerpoint, pdf, and other file types. Checkout Llama Hub
          for supported indexers.
        </p>
      </Dragger>
      <Button
        type='primary'
        onClick={() => uploadFile()}
        disabled={fileList.length === 0}
        loading={isLoading}
        style={{ marginTop: 16 }}>
        {isLoading ? 'Uploading' : 'Start Upload'}
      </Button>
    </div>
  );
}
