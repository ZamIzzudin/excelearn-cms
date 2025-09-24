/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Save,
  MoveLeft,
  Smartphone,
  Tablet,
  Monitor,
  Type,
  Image,
  Square,
  Layout,
  List,
  X,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  GripVertical,
} from "lucide-react";

// Komponen yang tersedia untuk drag & drop
const availableComponents = [
  {
    id: "text",
    name: "Text",
    icon: Type,
    category: "Basic",
    defaultProps: {
      content: "Sample text content",
      fontSize: 16,
      fontWeight: "normal",
      color: "#000000",
      backgroundColor: "transparent",
      padding: 16,
      textAlign: "left",
      backgroundImage: null,
    },
  },
  {
    id: "heading",
    name: "Heading",
    icon: Type,
    category: "Basic",
    defaultProps: {
      content: "Sample Heading",
      level: "h2",
      fontSize: 32,
      fontWeight: "bold",
      color: "#000000",
      backgroundColor: "transparent",
      padding: 16,
      textAlign: "left",
      backgroundImage: null,
    },
  },
  {
    id: "image",
    name: "Image",
    icon: Image,
    category: "Media",
    defaultProps: {
      src: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Sample image",
      width: "100%",
      height: "auto",
      borderRadius: 0,
      objectFit: "cover",
      backgroundImage: null,
    },
  },
  {
    id: "button",
    name: "Button",
    icon: Square,
    category: "Interactive",
    defaultProps: {
      text: "Click Me",
      backgroundColor: "#3B82F6",
      color: "#FFFFFF",
      padding: "12px 24px",
      borderRadius: 8,
      fontSize: 16,
      fontWeight: "medium",
      border: "none",
      cursor: "pointer",
      textAlign: "center",
      backgroundImage: null,
    },
  },
  {
    id: "list",
    name: "List",
    icon: List,
    category: "Basic",
    defaultProps: {
      items: ["Item 1", "Item 2", "Item 3"],
      listStyle: "disc",
      fontSize: 16,
      color: "#000000",
      padding: 16,
      textAlign: "left",
      backgroundImage: null,
    },
  },
];

// Dummy data untuk halaman yang sedang diedit
const dummyPageData = {
  id: 1,
  title: "Homepage",
  slug: "homepage",
  components: [
    {
      id: "comp-1",
      type: "heading",
      gridColumn: 12,
      order: 1,
      props: {
        content: "Welcome to Our Website",
        level: "h1",
        fontSize: 48,
        fontWeight: "bold",
        color: "#1F2937",
        backgroundColor: "transparent",
        padding: 32,
        textAlign: "center",
        backgroundImage: null,
      },
    },
    {
      id: "comp-2",
      type: "text",
      gridColumn: 8,
      order: 2,
      props: {
        content:
          "This is a sample paragraph text that demonstrates how the page builder works. You can edit this text and customize its appearance.",
        fontSize: 18,
        fontWeight: "normal",
        color: "#4B5563",
        backgroundColor: "transparent",
        padding: 24,
        textAlign: "center",
        backgroundImage: null,
      },
    },
    {
      id: "comp-3",
      type: "image",
      gridColumn: 6,
      order: 3,
      props: {
        src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Hero image",
        width: "100%",
        height: "300px",
        borderRadius: 12,
        objectFit: "cover",
        backgroundImage: null,
      },
    },
    {
      id: "comp-4",
      type: "button",
      gridColumn: 4,
      order: 4,
      props: {
        text: "Get Started",
        backgroundColor: "#3B82F6",
        color: "#FFFFFF",
        padding: "16px 32px",
        borderRadius: 8,
        fontSize: 18,
        fontWeight: "semibold",
        border: "none",
        cursor: "pointer",
        textAlign: "center",
        backgroundImage: null,
      },
    },
  ],
  uploadedImages: [], // Storage untuk gambar yang diupload
};

export default function PageEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pageData, setPageData] = useState(dummyPageData);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const [draggedCanvasComponent, setDraggedCanvasComponent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showComponentPanel, setShowComponentPanel] = useState(true);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);

  useEffect(() => {
    const title = searchParams.get("title");
    const slug = searchParams.get("slug");
    const isNew = searchParams.get("new");

    if (isNew && title && slug) {
      setPageData({
        id: Date.now(),
        title,
        slug,
        components: [],
        uploadedImages: [],
      });
    }
  }, [searchParams]);

  // Improved responsive grid calculation
  const getResponsiveColumns = (originalColumns: number) => {
    switch (viewMode) {
      case "mobile":
        // Mobile: komponen dengan lebar > 6 menjadi full width, sisanya tetap
        return originalColumns > 6 ? 12 : originalColumns;
      case "tablet":
        // Tablet: komponen dengan lebar > 8 menjadi full width, sisanya disesuaikan
        if (originalColumns > 8) return 12;
        if (originalColumns <= 4) return originalColumns;
        return Math.min(originalColumns + 2, 12);
      default:
        return originalColumns;
    }
  };

  const getGridClass = () => {
    return "grid-cols-12"; // Always use 12-column grid
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      default:
        return "max-w-6xl mx-auto";
    }
  };

  const handleDragStart = (component: any) => {
    setDraggedComponent(component);
  };

  const handleCanvasDragStart = (e: React.DragEvent, component: any) => {
    setDraggedCanvasComponent(component);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedComponent) {
      // Adding new component from library
      const newComponent = {
        id: `comp-${Date.now()}`,
        type: draggedComponent.id,
        gridColumn: 12,
        order: pageData.components.length + 1,
        props: { ...draggedComponent.defaultProps },
      };

      setPageData((prev) => ({
        ...prev,
        components: [...prev.components, newComponent],
      }));
      setDraggedComponent(null);
    }
  };

  const handleCanvasDrop = (e: React.DragEvent, targetComponent: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedCanvasComponent && draggedCanvasComponent.id !== targetComponent.id) {
      const draggedOrder = draggedCanvasComponent.order;
      const targetOrder = targetComponent.order;
      
      setPageData((prev) => ({
        ...prev,
        components: prev.components.map((comp) => {
          if (comp.id === draggedCanvasComponent.id) {
            return { ...comp, order: targetOrder };
          }
          if (comp.id === targetComponent.id) {
            return { ...comp, order: draggedOrder };
          }
          return comp;
        }),
      }));
    }
    setDraggedCanvasComponent(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateComponentProps = (componentId: string, newProps: any) => {
    setPageData((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.id === componentId
          ? { ...comp, props: { ...comp.props, ...newProps } }
          : comp
      ),
    }));
  };

  const updateComponentGrid = (componentId: string, gridColumn: number) => {
    setPageData((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.id === componentId ? { ...comp, gridColumn } : comp
      ),
    }));
  };

  const deleteComponent = (componentId: string) => {
    setPageData((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.id !== componentId),
    }));
    setSelectedComponent(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = {
          id: `img-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          data: event.target?.result as string,
          file: file, // Store original file for later upload
        };

        setPageData((prev) => ({
          ...prev,
          uploadedImages: [...prev.uploadedImages, imageData],
        }));

        // If we're editing a component, set this as background
        if (selectedComponent) {
          updateComponentProps(selectedComponent, {
            backgroundImage: imageData.data,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderComponent = (component: any) => {
    const { type, props } = component;
    const style = {
      fontSize: props.fontSize,
      fontWeight: props.fontWeight,
      color: props.color,
      backgroundColor: props.backgroundImage ? 'transparent' : props.backgroundColor,
      backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: props.padding,
      textAlign: props.textAlign,
      borderRadius: props.borderRadius,
      border: props.border,
      width: props.width,
      height: props.height,
      objectFit: props.objectFit,
      cursor: props.cursor,
      minHeight: props.minHeight,
    };

    switch (type) {
      case "text":
        return <p style={style}>{props.content}</p>;
      case "heading":
        const HeadingTag = props.level || "h2";
        return <HeadingTag style={style}>{props.content}</HeadingTag>;
      case "image":
        return <img src={props.src} alt={props.alt} style={style} />;
      case "button":
        return (
          <div style={{ textAlign: props.textAlign, padding: 0 }}>
            <button 
              style={{
                ...style,
                display: 'inline-block',
                textAlign: 'center',
                padding: props.padding,
              }}
            >
              {props.text}
            </button>
          </div>
        );
      case "container":
        return <div style={style}></div>;
      case "list":
        return (
          <ul style={{ ...style, listStyleType: props.listStyle }}>
            {props.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      default:
        return <div style={style}>Unknown component</div>;
    }
  };

  const savePageData = () => {
    console.log("Saving page data:", JSON.stringify(pageData, null, 2));
    // Implement save logic
  };

  const selectedComponentData = selectedComponent
    ? pageData.components.find((comp) => comp.id === selectedComponent)
    : null;

  return (
    <div className="h-screen flex bg-slate-50 relative overflow-hidden">
      {/* Component Library Panel */}
      {showComponentPanel && (
        <div className="w-64 lg:w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Components</h2>
            <button
              onClick={() => setShowComponentPanel(false)}
              className="lg:hidden p-1 hover:bg-slate-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {["Basic", "Media", "Interactive"].map((category) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-medium text-slate-600 mb-3">
                  {category}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {availableComponents
                    .filter((comp) => comp.category === category)
                    .map((component) => {
                      const Icon = component.icon;
                      return (
                        <div
                          key={component.id}
                          draggable
                          onDragStart={() => handleDragStart(component)}
                          className="p-3 border border-slate-200 rounded-lg cursor-grab hover:bg-slate-50 transition-colors active:cursor-grabbing"
                        >
                          <Icon className="w-5 h-5 text-slate-600 mb-2" />
                          <p className="text-xs font-medium text-slate-700">
                            {component.name}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="bg-white border-b border-slate-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!showComponentPanel && (
                <button
                  onClick={() => setShowComponentPanel(true)}
                  className="lg:hidden p-2 bg-slate-100 rounded-lg"
                >
                  <Layout className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => router.back()}
                className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm transition-all duration-300 hover:bg-slate-50"
              >
                <MoveLeft className="w-4 h-4 text-slate-600" />
              </button>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "desktop" ? "bg-white shadow-sm" : "hover:bg-slate-200"
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("tablet")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "tablet" ? "bg-white shadow-sm" : "hover:bg-slate-200"
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "mobile" ? "bg-white shadow-sm" : "hover:bg-slate-200"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h1 className="font-semibold text-slate-800 hidden md:block truncate max-w-xs">
              {pageData.title}
            </h1>

            <div className="flex items-center gap-2">
              {selectedComponent && !showPropertiesPanel && (
                <button
                  onClick={() => setShowPropertiesPanel(true)}
                  className="lg:hidden p-2 bg-slate-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={savePageData}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div
            className={`mx-auto bg-white rounded-lg shadow-sm min-h-96 transition-all duration-300 ${getViewportClass()}`}
          >
            <div
              className="p-6"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {pageData.components.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Drag components here to start building your page</p>
                </div>
              ) : (
                <div className={`grid ${getGridClass()} gap-4`}>
                  {pageData.components
                    .sort((a, b) => a.order - b.order)
                    .map((component) => {
                      const responsiveColumns = getResponsiveColumns(component.gridColumn);
                      return (
                        <div
                          key={component.id}
                          draggable
                          onDragStart={(e) => handleCanvasDragStart(e, component)}
                          onDrop={(e) => handleCanvasDrop(e, component)}
                          onDragOver={handleDragOver}
                          className={`col-span-${responsiveColumns} relative group cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
                          onClick={() => {
                            setSelectedComponent(component.id);
                            setShowPropertiesPanel(true);
                          }}
                        >
                          <div
                            className={`relative ${
                              selectedComponent === component.id
                                ? "ring-2 ring-indigo-500 ring-offset-2"
                                : ""
                            } rounded-lg transition-all`}
                          >
                            {renderComponent(component)}
                            
                            {/* Drag Handle */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-slate-800 text-white p-1 rounded cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-3 h-3" />
                              </div>
                            </div>
                          </div>

                          {selectedComponent === component.id && (
                            <div className="absolute -top-8 left-0 flex items-center gap-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs z-10">
                              <span className="capitalize">{component.type}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteComponent(component.id);
                                }}
                                className="hover:bg-indigo-700 rounded px-1 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedComponentData && (showPropertiesPanel || window.innerWidth >= 1024) && (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 lg:relative absolute right-0 top-0 h-full z-20">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Properties</h2>
            <button
              onClick={() => {
                setSelectedComponent(null);
                setShowPropertiesPanel(false);
              }}
              className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm transition-all duration-300 hover:bg-slate-50"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Grid Column */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Width ({selectedComponentData.gridColumn}/12 columns)
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={selectedComponentData.gridColumn}
                onChange={(e) =>
                  updateComponentGrid(
                    selectedComponentData.id,
                    parseInt(e.target.value)
                  )
                }
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 col</span>
                <span className="font-medium">
                  {Math.round((selectedComponentData.gridColumn / 12) * 100)}% width
                </span>
                <span>12 col</span>
              </div>
              
              {/* Responsive preview */}
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <div className="text-xs font-medium text-slate-600 mb-2">Preview on devices:</div>
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Desktop:</span>
                    <span>{Math.round((selectedComponentData.gridColumn / 12) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tablet:</span>
                    <span>{Math.round((getResponsiveColumns(selectedComponentData.gridColumn) / 12) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile:</span>
                    <span>{Math.round((getResponsiveColumns(selectedComponentData.gridColumn) / 12) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Alignment for text, heading, and button */}
            {(selectedComponentData.type === "text" ||
              selectedComponentData.type === "heading" ||
              selectedComponentData.type === "button") && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Alignment
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "left", icon: AlignLeft },
                    { value: "center", icon: AlignCenter },
                    { value: "right", icon: AlignRight },
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() =>
                        updateComponentProps(selectedComponentData.id, {
                          textAlign: value,
                        })
                      }
                      className={`flex-1 p-2 border rounded-lg transition-colors ${
                        selectedComponentData.props.textAlign === value
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Background Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Background Image
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 border-2 border-dashed border-slate-200 rounded-lg hover:border-indigo-300 transition-colors flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {selectedComponentData.props.backgroundImage && (
                  <div className="relative">
                    <img
                      src={selectedComponentData.props.backgroundImage}
                      alt="Background preview"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() =>
                        updateComponentProps(selectedComponentData.id, {
                          backgroundImage: null,
                        })
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Component-specific properties */}
            {(selectedComponentData.type === "text" ||
              selectedComponentData.type === "heading") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={selectedComponentData.props.content}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        content: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Font Size
                  </label>
                  <input
                    type="number"
                    min="8"
                    max="72"
                    value={selectedComponentData.props.fontSize}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        fontSize: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={selectedComponentData.props.color}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        color: e.target.value,
                      })
                    }
                    className="w-full h-10 border border-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}

            {selectedComponentData.type === "image" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={selectedComponentData.props.src}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        src: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={selectedComponentData.props.alt}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        alt: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Border Radius
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={selectedComponentData.props.borderRadius}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        borderRadius: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {selectedComponentData.type === "button" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={selectedComponentData.props.text}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        text: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Font Size
                  </label>
                  <input
                    type="number"
                    min="8"
                    max="32"
                    value={selectedComponentData.props.fontSize}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        fontSize: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Border Radius
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={selectedComponentData.props.borderRadius}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        borderRadius: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={selectedComponentData.props.backgroundColor}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-full h-10 border border-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={selectedComponentData.props.color}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        color: e.target.value,
                      })
                    }
                    className="w-full h-10 border border-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* Common properties */}
            {!selectedComponentData.props.backgroundImage && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={selectedComponentData.props.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    updateComponentProps(selectedComponentData.id, {
                      backgroundColor: e.target.value,
                    })
                  }
                  className="w-full h-10 border border-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Padding
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={selectedComponentData.props.padding}
                onChange={(e) =>
                  updateComponentProps(selectedComponentData.id, {
                    padding: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="text-xs text-slate-500 mt-1">
                Spacing around content (px)
              </div>
            </div>

            {/* Uploaded Images Gallery */}
            {pageData.uploadedImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Uploaded Images
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {pageData.uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.data}
                        alt={image.name}
                        className="w-full h-16 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() =>
                          updateComponentProps(selectedComponentData.id, {
                            backgroundImage: image.data,
                          })
                        }
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          Use
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile overlay for properties panel */}
      {showPropertiesPanel && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setShowPropertiesPanel(false)}
        />
      )}
    </div>
  );
}