/** @format */

import React, { useState } from "react";
import {
  Input,
  InputNumber,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Upload,
  Switch,
  Radio,
  Checkbox,
  Spin,
} from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { CircleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { uploadToCloudinary } from "@/lib/cloudinary";

const { TextArea } = Input;
const { Option } = Select;

type InputFormProps = {
  type?:
    | "text"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "date"
    | "datetime"
    | "file"
    | "file-cloud"
    | "switch"
    | "radio"
    | "checkbox"
    | "time";
  name: string;
  form?: Record<string, any>;
  setForm?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  icon?: React.ReactNode;
  options?: Array<{ label: string; value: any }>;
  multiple?: boolean;
  accept?: string;
  size?: "small" | "middle" | "large";
  variant?: "outlined" | "filled" | "borderless";
  folder?: string;
  maxSize?: number;
};

const InputForm: React.FC<InputFormProps> = ({
  type = "text",
  name,
  form = {},
  setForm = () => {},
  label,
  placeholder,
  disabled = false,
  className,
  required = false,
  icon,
  options = [],
  multiple = false,
  accept,
  size = "large",
  variant = "outlined",
  folder = "excelearn/uploads",
  maxSize,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value?.target ? value.target.value : value,
    }));
  };

  const baseInputClass = cn(
    "transition-all duration-200",
    "border-slate-200 hover:border-slate-300 focus:border-primary-500",
    "rounded-xl",
    className
  );

  const labelClass =
    "text-sm font-medium text-slate-700 mb-2 flex items-center gap-1";

  let inputElement;

  switch (type) {
    case "text":
      inputElement = (
        <Input
          value={form[name] || undefined}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          variant={variant}
          prefix={icon && <div className="mr-3">{icon}</div>}
          className={baseInputClass}
        />
      );
      break;

    case "password":
      inputElement = (
        <Input.Password
          value={form[name] || undefined}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          variant={variant}
          prefix={icon && <div className="mr-3">{icon}</div>}
          className={baseInputClass}
        />
      );
      break;

    case "number":
      inputElement = (
        <InputNumber
          value={form[name] || undefined}
          onChange={(val) => handleChange(val)}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          variant={variant}
          className={cn(baseInputClass, "w-full")}
        />
      );
      break;

    case "textarea":
      inputElement = (
        <TextArea
          size={size}
          value={form[name] || undefined}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoSize={{ minRows: 3, maxRows: 6 }}
          className={baseInputClass}
        />
      );
      break;

    case "time":
      inputElement = (
        <TimePicker
          size={size}
          value={form[name] || undefined}
          onChange={(e) => {
            handleChange(dayjs(e).format("HH:mm"));
          }}
          placeholder={placeholder}
          disabled={disabled}
          defaultOpenValue={dayjs("00:00", "HH:mm")}
          format={"HH:mm"}
          className={cn(baseInputClass, "w-full")}
        />
      );
      break;
    case "select":
      inputElement = (
        <Select
          value={form[name] || undefined}
          onChange={(val) => handleChange(val)}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          variant={variant}
          mode={multiple ? "multiple" : undefined}
          className={cn("w-full", className)}
          dropdownClassName="rounded-xl border-slate-200"
        >
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      );
      break;

    case "date":
      inputElement = (
        <DatePicker
          value={form[name] || undefined}
          onChange={(date) => handleChange(date)}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          variant={variant}
          className={cn(baseInputClass, "w-full")}
        />
      );
      break;

    case "datetime":
      inputElement = (
        <DatePicker
          value={form[name] || undefined}
          onChange={(date) => handleChange(date)}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          showTime
          variant={variant}
          className={cn(baseInputClass, "w-full")}
        />
      );
      break;

    case "file":
      const FILE_MAX_SIZE = maxSize || 2 * 1024 * 1024; // Default 2MB
      const fileSizeLabel = FILE_MAX_SIZE >= 1024 * 1024 
        ? `${FILE_MAX_SIZE / (1024 * 1024)}MB` 
        : `${FILE_MAX_SIZE / 1024}KB`;
      inputElement = (
        <Upload
          fileList={[]}
          onChange={(info: any) => {
            if (info?.file) {
              if (info.file.size > FILE_MAX_SIZE) {
                import("antd").then(({ message }) => {
                  message.error(`Ukuran file maksimal ${fileSizeLabel}`);
                });
                return;
              }
              const reader = new FileReader();
              reader.onload = (event) => {
                const imageData = {
                  id: `img-${Date.now()}`,
                  name: info?.file.name,
                  size: info?.file.size,
                  type: info?.file.type,
                  data: event.target?.result as string,
                  file: info?.file,
                };
                handleChange(imageData);
              };
              reader.readAsDataURL(info?.file);
            }
          }}
          beforeUpload={() => false}
          accept={accept}
          className="w-full"
        >
          {form[name]?.data ? (
            <div className="relative">
              <img
                src={form[name].data}
                alt="Preview"
                className="w-full h-32 object-cover rounded-xl border-2 border-slate-200"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange(null);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              className={cn(
                "border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <UploadOutlined className="text-2xl text-slate-400 mb-2" />
              <p className="text-slate-600">Click or drag files to upload</p>
              {accept && (
                <p className="text-xs text-slate-400 mt-1">Accepted: {accept}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">Maksimal {fileSizeLabel}</p>
            </div>
          )}
        </Upload>
      );
      break;

    case "file-cloud":
      const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB untuk image
      const VIDEO_MAX_SIZE = 100 * 1024 * 1024; // 100MB untuk video
      
      const getFileSizeLimit = (file: File) => {
        if (file.type.startsWith("video/")) {
          return VIDEO_MAX_SIZE;
        }
        return maxSize || IMAGE_MAX_SIZE;
      };

      const formatSize = (bytes: number) => {
        if (bytes >= 1024 * 1024) {
          return `${bytes / (1024 * 1024)}MB`;
        }
        return `${bytes / 1024}KB`;
      };
      
      const handleCloudUpload = async (file: File) => {
        const sizeLimit = getFileSizeLimit(file);
        
        if (file.size > sizeLimit) {
          const fileType = file.type.startsWith("video/") ? "Video" : "Image";
          import("antd").then(({ message }) => {
            message.error(`Ukuran ${fileType} maksimal ${formatSize(sizeLimit)}`);
          });
          return;
        }

        setIsUploading(true);
        try {
          const result = await uploadToCloudinary(file, folder);
          handleChange({
            url: result.secure_url,
            public_id: result.public_id,
            name: file.name,
            size: file.size,
            type: file.type,
          });
          import("antd").then(({ message }) => {
            message.success("File berhasil diupload");
          });
        } catch (error: any) {
          import("antd").then(({ message }) => {
            message.error(error.message || "Gagal mengupload file");
          });
        } finally {
          setIsUploading(false);
        }
      };

      inputElement = (
        <Upload
          fileList={[]}
          onChange={(info: any) => {
            if (info?.file) {
              handleCloudUpload(info.file);
            }
          }}
          beforeUpload={() => false}
          accept={accept}
          className="w-full"
          disabled={disabled || isUploading}
        >
          {isUploading ? (
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-blue-50">
              <Spin indicator={<LoadingOutlined className="text-2xl text-blue-500" spin />} />
              <p className="text-blue-600 mt-2">Mengupload file...</p>
            </div>
          ) : form[name]?.url ? (
            <div className="relative">
              {form[name].type?.startsWith("video/") ? (
                <video
                  src={form[name].url}
                  className="w-full h-32 object-cover rounded-xl border-2 border-slate-200"
                />
              ) : (
                <img
                  src={form[name].url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-xl border-2 border-slate-200"
                />
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange(null);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={14} />
              </button>
              <p className="text-xs text-slate-500 mt-1 truncate">{form[name].name}</p>
            </div>
          ) : (
            <div
              className={cn(
                "border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <UploadOutlined className="text-2xl text-slate-400 mb-2" />
              <p className="text-slate-600">Click or drag files to upload</p>
              {accept && (
                <p className="text-xs text-slate-400 mt-1">Accepted: {accept}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                Image maks {formatSize(maxSize || IMAGE_MAX_SIZE)}, Video maks {formatSize(VIDEO_MAX_SIZE)}
              </p>
            </div>
          )}
        </Upload>
      );
      break;

    case "switch":
      inputElement = (
        <Switch
          checked={form[name] || false}
          onChange={(checked) => handleChange(checked)}
          disabled={disabled}
          className="bg-slate-200"
        />
      );
      break;

    case "radio":
      inputElement = (
        <Radio.Group
          value={form[name] || undefined}
          onChange={handleChange}
          disabled={disabled}
          className="space-y-2"
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value} className="block">
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      );
      break;

    case "checkbox":
      inputElement = (
        <div className="bg-slate-50 border border-slate-300 p-2 rounded-md h-full">
          <Checkbox
            key={name}
            className="flex"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                [name]: e?.target ? e.target.checked : false,
              }))
            }
            checked={form[name] || undefined}
          >
            {placeholder}
          </Checkbox>
        </div>
      );
      break;

    default:
      inputElement = (
        <Input
          value={form[name] || undefined}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          variant={variant}
          prefix={icon && <div className="mr-3">{icon}</div>}
          className={baseInputClass}
        />
      );
      break;
  }

  return (
    <Form.Item
      className={className}
      label={
        label && (
          <span className={labelClass}>
            {label}
            {required && <CircleAlert size={12} color="gray" />}
          </span>
        )
      }
      name={name}
      rules={
        required
          ? [{ required: true, message: `${label || "Field"} is required` }]
          : []
      }
    >
      {inputElement}
    </Form.Item>
  );
};

export default InputForm;
