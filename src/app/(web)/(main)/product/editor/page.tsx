/** @format */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowLeft, Plus, X } from "lucide-react";
import { Form, Row, Col } from "antd";
import InputForm from "@/components/Form";

import { useCreateProduct, useProductsDetail, useUpdateProduct } from "../hook";

import Image from "next/image";
import Notification from "@/components/Notification";

const CATEGORIES = ["IT Training", "IT Consultant", "IT Support"];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Expert", "All Level"];

const LANGUAGES = ["Indonesia", "Inggris"];

export default function ProductEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [form] = Form.useForm();

  const { data: existingProduct } = useProductsDetail(productId || "");
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const [formAction, setFormAction] = useState<any>({
    benefits: [],
    instructor_list: [],
  });

  const [newBenefit, setNewBenefit] = useState({ benefit: null });
  const [newInstructor, setNewInstructor] = useState<any>({
    instructor_name: null,
    instructor_photo: null,
  });

  useEffect(() => {
    if (existingProduct) {
      form.setFieldsValue(existingProduct);
      setFormAction(existingProduct);
    }
  }, [existingProduct]);

  const handleAddBenefit = () => {
    if (newBenefit?.benefit) {
      setFormAction((prev: any) => ({
        ...prev,
        benefits: [...prev?.benefits, newBenefit.benefit],
      }));
      setNewBenefit({ benefit: null });
      form.setFieldValue("benefit", undefined);
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormAction((prev: any) => ({
      ...prev,
      benefits: prev?.benefits?.filter((_: string, i: number) => i !== index),
    }));
  };

  const handleAddInstructor = () => {
    if (newInstructor?.instructor_name) {
      setFormAction((prev: any) => ({
        ...prev,
        instructor_list: [
          ...prev?.instructor_list,
          {
            name: newInstructor.instructor_name,
            photo: newInstructor.instructor_photo,
          },
        ],
      }));
      setNewInstructor({ instructor_name: null, instructor_photo: null });
      form.setFieldValue("instructor_name", undefined);
      form.setFieldValue("instructor_photo", undefined);
    }
  };

  const handleRemoveInstructor = (index: number) => {
    setFormAction((prev: any) => ({
      ...prev,
      instructor_list: prev?.instructor_list?.filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };

  const handleAddProduct = async () => {
    try {
      await form.validateFields();

      const formData = new FormData();

      formData.append("product_name", formAction.product_name);
      formData.append("product_description", formAction.product_description);
      formData.append("skill_level", formAction.skill_level);
      formData.append("product_category", formAction.product_category);
      formData.append("language", formAction.language);
      formData.append("max_participant", formAction.max_participant);
      formData.append("duration", formAction.duration);

      formAction.benefits?.forEach((benefit: string) => {
        formData.append("benefits", benefit);
      });

      // Append instructor list
      formAction.instructor_list?.forEach((instructor: any, index: number) => {
        formData.append(`instructor_list[${index}][name]`, instructor.name);
        if (instructor.photo?.file) {
          formData.append(`instructor_photos`, instructor.photo.file);
          formData.append(`instructor_photo_indexes`, index.toString());
        } else if (instructor.photo?.url) {
          formData.append(
            `instructor_list[${index}][photo]`,
            JSON.stringify(instructor.photo)
          );
        }
      });

      if (formAction?.banner?.file) {
        formData.append("file", formAction?.banner?.file ?? null);
      }

      createProduct(formData, {
        onSuccess: () => {
          Notification("success", "Success Add New Product");
          router.back();
        },
        onError: (e) => {
          Notification("error", "Failed to Add New Product");
          console.log(e);
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateProduct = async () => {
    if (!productId) return;

    try {
      await form.validateFields();

      const formData = new FormData();

      formData.append("product_name", formAction.product_name);
      formData.append("product_description", formAction.product_description);
      formData.append("skill_level", formAction.skill_level);
      formData.append("product_category", formAction.product_category);
      formData.append("language", formAction.language);
      formData.append("max_participant", formAction.max_participant);
      formData.append("duration", formAction.duration);

      formAction.benefits?.forEach((benefit: string) => {
        formData.append("benefits", benefit);
      });

      // Append instructor list
      formAction.instructor_list?.forEach((instructor: any, index: number) => {
        formData.append(`instructor_list[${index}][name]`, instructor.name);
        if (instructor.photo?.file) {
          formData.append(`instructor_photos`, instructor.photo.file);
          formData.append(`instructor_photo_indexes`, index.toString());
        } else if (instructor.photo?.url) {
          formData.append(
            `instructor_list[${index}][photo]`,
            JSON.stringify(instructor.photo)
          );
        }
      });

      if (formAction?.banner?.file) {
        formData.append("file", formAction?.banner?.file ?? null);
      } else {
        const parsed = JSON.stringify(formAction?.banner);
        formData.append("banner", parsed);
      }

      updateProduct(
        { id: productId, data: formData },
        {
          onSuccess: () => {
            Notification("success", "Success to Update Product");
            router.back();
          },
          onError: (e) => {
            Notification("error", "Failed to Update Product");
            console.log(e);
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              {productId ? "Edit Product" : "Create Product"}
            </h1>
            <p className="text-slate-600 mt-1">
              {productId
                ? "Update product information"
                : "Add a new service product"}
            </p>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="space-y-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <InputForm
                type="text"
                name="product_name"
                label="Product Name"
                placeholder="Enter product name"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="select"
                name="product_category"
                label="Product Category"
                placeholder="Choose product category"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
                options={CATEGORIES.map((type: string) => ({
                  label: type,
                  value: type.replace(" ", "_").toUpperCase(),
                }))}
              />
              <InputForm
                type="textarea"
                name="product_description"
                label="Product Overview"
                placeholder="Enter product overview"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 pt-6 pb-3">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Benefits
            </h2>
            <div className="space-y-3">
              <div className="flex gap-2 items-start">
                <div className="flex-grow">
                  <InputForm
                    type="text"
                    name="benefit"
                    label=""
                    placeholder="Add a benefit..."
                    form={newBenefit}
                    setForm={(e: any) => setNewBenefit(e)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>

              {formAction?.benefits?.length > 0 && (
                <div className="space-y-2 pb-3">
                  {formAction?.benefits?.map(
                    (benefit: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <span className="text-slate-700">{benefit}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(index)}
                          className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 pt-6 pb-3">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Instructors
            </h2>
            <div className="space-y-3">
              <div className="space-y-3">
                <InputForm
                  type="text"
                  name="instructor_name"
                  label="Instructor Name"
                  placeholder="Enter instructor name"
                  form={newInstructor}
                  setForm={(e: any) => setNewInstructor(e)}
                />

                {newInstructor?.instructor_photo ? (
                  <div className="relative">
                    <Image
                      src={
                        newInstructor?.instructor_photo?.url ||
                        newInstructor?.instructor_photo?.data
                      }
                      alt="instructor photo"
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setNewInstructor((prev: any) => ({
                          ...prev,
                          instructor_photo: null,
                        }))
                      }
                      className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <InputForm
                    type="file"
                    name="instructor_photo"
                    label="Instructor Photo"
                    accept="image/*"
                    form={newInstructor}
                    setForm={(e: any) => setNewInstructor(e)}
                  />
                )}

                <button
                  type="button"
                  onClick={handleAddInstructor}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Instructor
                </button>
              </div>

              {formAction?.instructor_list?.length > 0 && (
                <div className="space-y-2 pb-3 pt-4">
                  {formAction?.instructor_list?.map(
                    (instructor: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        {instructor?.photo && (
                          <Image
                            src={
                              instructor.photo?.data || instructor.photo?.url
                            }
                            alt={instructor.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                        )}
                        <span className="flex-grow text-slate-700 font-medium">
                          {instructor.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInstructor(index)}
                          className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Product Details
            </h2>

            <div className="space-y-4">
              <InputForm
                type="select"
                name="skill_level"
                label="Skill Level"
                placeholder="Choose skill level"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
                options={SKILL_LEVELS.map((type: string) => ({
                  label: type,
                  value: type.replace(" ", "_").toUpperCase(),
                }))}
              />
              <InputForm
                type="select"
                name="language"
                label="Language"
                placeholder="Choose language"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
                options={LANGUAGES.map((type: string) => ({
                  label: type,
                  value: type.replace(" ", "_").toUpperCase(),
                }))}
              />
              <InputForm
                type="number"
                name="max_participant"
                label="Max Participant"
                placeholder="Enter max participant"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="number"
                name="duration"
                label="Session Duration"
                placeholder="Enter session duration (in minutes, e.g 45 minutes)"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 pt-6 pb-3">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Banner
            </h2>
            {formAction?.banner ? (
              <div className="relative mb-5">
                <Image
                  src={formAction?.banner?.data || formAction?.banner?.url}
                  alt="uploaded banner"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormAction((prev: any) => ({
                      ...prev,
                      banner: undefined,
                    }))
                  }
                  className="p-1 hover:bg-gray-100 hover:text-red-500 rounded text-white transition-colors absolute top-5 right-5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <InputForm
                type="file"
                name="banner"
                label=""
                accept="image/*"
                className="mb-5"
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                productId ? handleUpdateProduct() : handleAddProduct()
              }
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {productId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{productId ? "Update Product" : "Add Product"}</>
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
