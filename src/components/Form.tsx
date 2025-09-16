/** @format */

import React from "react";
import { Input, InputNumber, Form } from "antd";

type InputFormProps = {
  type?: "text" | "password" | "number" | "textarea";
  name: string;
  form?: Record<string, any>;
  setForm?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
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
}) => {
  const handleChange = (value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value?.target ? value.target.value : value,
    }));
  };

  let inputElement;
  switch (type) {
    case "text":
      inputElement = (
        <Input
          value={form[name] || undefined}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full"
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
          style={{ width: "100%" }}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <Input.TextArea
          value={form[name] || undefined}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoSize={{ minRows: 3 }}
        />
      );
      break;
    default:
      inputElement = (
        <Input
          value={form[name] || undefined}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      );
      break;
  }

  return (
    <Form.Item
      className={`${className}`}
      label={label}
      name={name}
      rules={
        required
          ? [{ required: true, message: "Please input your password!" }]
          : []
      }
    >
      {inputElement}
    </Form.Item>
  );
};

export default InputForm;
