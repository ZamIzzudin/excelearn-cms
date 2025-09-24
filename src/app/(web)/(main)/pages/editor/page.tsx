/** @format */

"use client";

import { useState, useEffect } from "react";
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
      },
    },
  ],
};

export default function PageEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [pageData, setPageData] = useState(dummyPageData);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<1 | 2 | 3>(1);
  const [showComponentPanel, setShowComponentPanel] = useState(true);

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
      });
    }
  }, [searchParams]);

  const handleDragStart = (component: any) => {
    setDraggedComponent(component);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedComponent) return;

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

  const renderComponent = (component: any) => {
    const { type, props } = component;
    const style = {
      fontSize: props.fontSize,
      fontWeight: props.fontWeight,
      color: props.color,
      backgroundColor: props.backgroundColor,
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
        return <button style={style}>{props.text}</button>;
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

  const getViewportClass = () => {
    switch (viewMode) {
      case 3:
        return "max-w-sm";
      case 2:
        return "max-w-2xl";
      default:
        return "max-w-full";
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
    <div className="h-screen flex bg-slate-50 relative">
      {/* Component Library Panel */}
      {showComponentPanel && (
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Components</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {["Basic", "Media", "Interactive"].map((category) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-medium text-slate-600 mb-3">
                  {category}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableComponents
                    .filter((comp) => comp.category === category)
                    .map((component) => {
                      const Icon = component.icon;
                      return (
                        <div
                          key={component.id}
                          draggable
                          onDragStart={() => handleDragStart(component)}
                          className="p-3 border border-slate-200 rounded-lg cursor-grab hover:bg-slate-50 transition-colors"
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
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="hidden text-sm lg:block p-2 bg-white border border-slate-200 rounded-lg shadow-sm transition-all duration-300"
              >
                <MoveLeft size={10} className="w-4 h-4 text-slate-600" />
              </button>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode(1)}
                  className={`p-2 rounded ${
                    viewMode === 1 ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode(2)}
                  className={`p-2 rounded ${
                    viewMode === 2 ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode(3)}
                  className={`p-2 rounded ${
                    viewMode === 3 ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h1 className="font-semibold text-slate-800">{pageData.title}</h1>

            <button
              onClick={savePageData}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <div
            className={`mx-auto bg-white rounded-lg shadow-sm min-h-96 ${getViewportClass()}`}
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
                <div
                  // Tailwind safelist: grid-cols-12 grid-cols-6 grid-cols-3

                  className={`grid grid-cols-${12 / viewMode} gap-4`}
                >
                  {pageData.components
                    .sort((a, b) => a.order - b.order)
                    .map((component) => (
                      <div
                        key={component.id}
                        // Tailwind safelist: col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7 col-span-8 col-span-9 col-span-10 col-span-11 col-span-12
                        className={`col-span-${Math.floor(
                          component.gridColumn / viewMode
                        )} relative group cursor-pointer`}
                        onClick={() => setSelectedComponent(component.id)}
                      >
                        <div
                          className={`${
                            selectedComponent === component.id
                              ? "ring-2 ring-indigo-500"
                              : ""
                          } rounded-lg`}
                        >
                          {renderComponent(component)}
                        </div>

                        {selectedComponent === component.id && (
                          <div className="absolute -top-8 left-0 flex items-center gap-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs">
                            <span className="capitalize">{component.type}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteComponent(component.id);
                              }}
                              className="hover:bg-indigo-700 rounded px-1"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedComponentData && (
        <div className="w-80 h-full bg-white border-l border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Properties</h2>
            <button
              onClick={() => setSelectedComponent(null)}
              className="hidden text-sm lg:block p-2 bg-white border border-slate-200 rounded-lg shadow-sm transition-all duration-300"
            >
              <X size={10} className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Grid Column */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Grid Columns (1-12)
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
                className="w-full"
              />
              <div className="text-sm text-slate-500 mt-1">
                {selectedComponentData.gridColumn}/12 columns
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Font Size
                  </label>
                  <input
                    type="number"
                    value={selectedComponentData.props.fontSize}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        fontSize: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
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
                    className="w-full h-10 border border-slate-200 rounded-lg"
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Border Radius
                  </label>
                  <input
                    type="number"
                    value={selectedComponentData.props.borderRadius}
                    onChange={(e) =>
                      updateComponentProps(selectedComponentData.id, {
                        borderRadius: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
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
                    className="w-full h-10 border border-slate-200 rounded-lg"
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
                    className="w-full h-10 border border-slate-200 rounded-lg"
                  />
                </div>
              </>
            )}

            {/* Common properties */}
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
                className="w-full h-10 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Padding
              </label>
              <input
                type="number"
                value={selectedComponentData.props.padding}
                onChange={(e) =>
                  updateComponentProps(selectedComponentData.id, {
                    padding: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>
        // <div className="flex absolute top-0 left-0 right-0 bottom-0 bg-[#00000030] justify-end">

        // </div>
      )}
    </div>
  );
}
