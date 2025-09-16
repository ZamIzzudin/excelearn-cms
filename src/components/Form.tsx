/** @format */

import React from "react";
import {
  Input,
  InputNumber,
  Form,
  Select,
  DatePicker,
  Upload,
  Switch,
  Radio,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

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
    | "file"
    | "switch"
    | "radio"
    | "checkbox";
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
}) => {
  const handleChange = (value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value?.target ? value.target.value : value,
    }));
  };

  const baseInputClass = cn(
    "transition-all duration-200",
    "border-slate-200 hover:border-slate-300 focus:border-indigo-500",
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
          prefix={<div className="mr-3">{icon}</div>}
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
          prefix={<div className="mr-3">{icon}</div>}
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
          value={form[name] || undefined}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoSize={{ minRows: 3, maxRows: 6 }}
          className={baseInputClass}
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

    case "file":
      inputElement = (
        <Upload
          fileList={form[name] || []}
          onChange={(info) => handleChange(info.fileList)}
          beforeUpload={() => false}
          multiple={multiple}
          accept={accept}
          className="w-full"
        >
          <div
            className={cn(
              "border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <UploadOutlined className="text-2xl text-slate-400 mb-2" />
            <p className="text-slate-600">Click or drag files to upload</p>
            {accept && (
              <p className="text-xs text-slate-400 mt-1">Accepted: {accept}</p>
            )}
          </div>
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
        <Checkbox.Group
          value={form[name] || []}
          onChange={(checkedValues) => handleChange(checkedValues)}
          disabled={disabled}
          className="space-y-2"
        >
          {options.map((option) => (
            <Checkbox key={option.value} value={option.value} className="block">
              {option.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
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
          prefix={<div className="mr-3">{icon}</div>}
          className={baseInputClass}
        />
      );
      break;
  }

  return (
    <Form.Item
      className={cn("mb-6", className)}
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
