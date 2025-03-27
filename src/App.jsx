import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./App.css";
import Close from "./assets/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import Arrow from "./assets/arrow_forward_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

const DEFAULT_LOGO = "/Citi.svg.png";
const DEFAULT_BANNER = "/Citi-red.svg";

function App() {
  const [display, setDisplay] = useState(true);

  // State for logo
  const [logoDataURL, setLogoDataURL] = useState(
    localStorage.getItem("logoDataURL") || DEFAULT_LOGO
  );

  const [logoUploadedURL, setLogoUploadedURL] = useState(
    localStorage.getItem("logoUploadedURL") || DEFAULT_LOGO
  );
  const [logoFile, setLogoFile] = useState(null);

  // State for banner image
  const [bannerDataURL, setBannerDataURL] = useState(
    localStorage.getItem("bannerDataURL") || DEFAULT_BANNER
  );
  const [bannerUploadedURL, setBannerUploadedURL] = useState(
    localStorage.getItem("bannerUploadedURL") || DEFAULT_BANNER
  );
  const [bannerFile, setBannerFile] = useState(null);

  // Handle logo file drop
  const onDropLogo = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    console.log("Selected file:", file); // Debugging: Log the selected file

    const reader = new FileReader();
    reader.onload = () => {
      const binaryStr = reader.result;
      setLogoDataURL(binaryStr);
      localStorage.setItem("logoDataURL", binaryStr);
    };
    reader.readAsDataURL(file);
    setLogoFile(file); // Set the logoFile state
  }, []);

  // Handle banner file drop
  const onDropBanner = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const binaryStr = reader.result;
      setBannerDataURL(binaryStr);
      localStorage.setItem("bannerDataURL", binaryStr);
    };
    reader.readAsDataURL(file);
    setBannerFile(file);
  }, []);

  // React-dropzone setup for logo and banner
  const {
    getRootProps: getLogoRootProps,
    getInputProps: getLogoInputProps,
    isDragActive: isLogoDragActive,
  } = useDropzone({
    onDrop: onDropLogo,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 5242880, // 5MB
  });

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
    isDragActive: isBannerDragActive,
  } = useDropzone({
    onDrop: onDropBanner,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 5242880, // 5MB
  });

  // Upload logo image to Cloudinary
  const uploadLogoImage = async () => {
    console.log("logoFile state:", logoFile); // Debugging: Log the logoFile state
    if (!logoFile) {
      console.log("No file selected for upload");
      return;
    }

    let formData = new FormData();
    formData.append("file", logoFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

    try {
      // debugger;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Upload failed: ${response.statusText}. Details: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      setLogoUploadedURL(data.url);
      localStorage.setItem("logoUploadedURL", data.url); // Store uploaded URL
    } catch (error) {
      console.error("Error uploading logo file:", error);
    }
  };

  // Upload banner image to Cloudinary
  const uploadBannerImage = async () => {
    console.log("logoFile state:", bannerFile); // Debugging: Log the logoFile state
    if (!bannerFile) {
      console.log("No file selected for upload");
      return;
    }

    let formData = new FormData();
    formData.append("file", bannerFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Upload failed: ${response.statusText}. Details: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      setBannerUploadedURL(data.url);
      localStorage.setItem("bannerUploadedURL", data.url); // Store uploaded URL
    } catch (error) {
      console.error("Error uploading logo file:", error);
    }
  };

  // Remove logo
  const removeLogo = () => {
    setLogoDataURL(null);
    setLogoUploadedURL(null);
    setLogoFile(null);
    localStorage.removeItem("logoDataURL");
    localStorage.removeItem("logoUploadedURL");
  };

  // Remove banner
  const removeBanner = () => {
    setBannerDataURL(null);
    setBannerUploadedURL(null);
    setBannerFile(null);
    localStorage.removeItem("bannerDataURL");
    localStorage.removeItem("bannerUploadedURL");
  };

  // Banner style and copy state
  const [bannerStyle, setBannerStyle] = useState(() => {
    const savedBannerStyle = localStorage.getItem("bannerStyle");
    return savedBannerStyle && savedBannerStyle !== "null"
      ? JSON.parse(savedBannerStyle)
      : {
          backgroundColor: "white",
          color: "black",
        };
  });

  const [bannerCopy, setBannerCopy] = useState(() => {
    const savedBannerCopy = localStorage.getItem("bannerCopy");
    return savedBannerCopy && savedBannerCopy !== "null"
      ? JSON.parse(savedBannerCopy)
      : {
          headline: "THE VALUE OF TIME",
          copyText: "Citibank was the first to save time",
          ctaBtnText: "Sign up",
        };
  });

  // Save banner copy and style to localStorage
  useEffect(() => {
    localStorage.setItem("bannerCopy", JSON.stringify(bannerCopy));
  }, [bannerCopy]);

  useEffect(() => {
    localStorage.setItem("bannerStyle", JSON.stringify(bannerStyle));
  }, [bannerStyle]);

  // Handle changes to banner copy
  const handleCopy = (e) => {
    const { name, value } = e.target;
    setBannerCopy((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes to banner style
  const handleBannerStyle = (e) => {
    const { name, value } = e.target;
    setBannerStyle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="banner-container">
      {display && (
        <div
          data-testid="ads-banner-container"
          className="ads-banner-container"
          style={{
            backgroundColor: bannerStyle.backgroundColor,
            color: bannerStyle.color,
          }}
        >
          <div className="ads-banner-content">
            <div className="ads-banner-logo">
              {logoUploadedURL && (
                <img
                  src={logoUploadedURL}
                  alt="Uploaded Logo"
                  className="logo-preview"
                />
              )}
            </div>
            <div className="ads-banner-image">
              {bannerUploadedURL && (
                <img
                  src={bannerUploadedURL}
                  alt="Uploaded Banner"
                  className="banner-image-preview"
                />
              )}
            </div>
            <div className="ads-banner-text-container">
              <div className="text-container">
                <div className="headline-container">
                  <h3 className="headine-copy-text">{bannerCopy.headline}</h3>
                </div>
                <div className="copy-text-container">
                  <p className="copy-text">{bannerCopy.copyText}</p>
                </div>
              </div>
              {/* call to action button */}
              <div
                style={{
                  background: bannerStyle.color,
                }}
                className="seperator"
              ></div>
              <div className="cta-btn-container">
                <button
                  className="cta-btn"
                  aria-label={bannerCopy.ctaBtnText}
                  onClick={() => (window.location.href = "#")} // Or your actual link
                >
                  <span className="cta-text">{bannerCopy.ctaBtnText}</span>
                  <img
                    src={Arrow}
                    alt="" // Empty alt since arrow is decorative
                    className="cta-arrow"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="close-btn-container">
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                setDisplay((prev) => !prev);
              }}
              aria-label="close"
            >
              <img src={Close} alt="close" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Form for controlling the inputs in the banner */}
      <div className="ads-banner-control">
        <div className="form-container">
          <form
            onSubmit={(e) => e.preventDefault()}
            aria-labelledby="form-title"
            className="form-container"
          >
            <h2 id="form-title">Customize Your Banner</h2>
            <fieldset>
              {/* Background color picker */}
              <label
                htmlFor="backgroundColor"
                className="banner-backgroundColor-change"
              >
                Background color
              </label>
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={bannerStyle.backgroundColor}
                onChange={handleBannerStyle}
                className="backgroundColor-input"
                aria-label="Background color picker"
              />

              {/* Text color picker */}
              <label htmlFor="color" className="banner-color-change">
                Text color
              </label>
              <input
                type="color"
                id="color"
                name="color"
                value={bannerStyle.color}
                onChange={handleBannerStyle}
                className="color-input"
                aria-label="Color picker"
              />

              {/* Headline input */}
              <label
                htmlFor="headingText"
                className="banner-heading-text-change"
              >
                Headline
              </label>
              <input
                type="text"
                id="headingText"
                name="headline"
                value={bannerCopy.headline}
                onChange={handleCopy}
                className="heading-text-input"
                placeholder="Enter your headline"
                required
                aria-label="Heading Text"
              />

              {/* Copy text input */}
              <label
                htmlFor="subtitleText"
                className="banner-subtitle-text-change"
              >
                Copy Text
              </label>
              <input
                type="text"
                id="subtitleText"
                name="copyText"
                value={bannerCopy.copyText}
                onChange={handleCopy}
                className="subtitle-text-input"
                placeholder="Enter your copy text"
                aria-label="Copy text"
              />

              {/* CTA button text input */}
              <label
                htmlFor="ctaBtnText"
                className="banner-cta-btn-text-change"
              >
                CTA Button Text
              </label>
              <input
                type="text"
                id="ctaBtnText"
                name="ctaBtnText"
                value={bannerCopy.ctaBtnText}
                onChange={handleCopy}
                className="cta-btn-text-input"
                placeholder="Enter your CTA button text"
                aria-label="CTA button"
              />

              {/* Logo upload section */}
              <label htmlFor="logo" className="banner-logo-upload">
                Upload Logo
              </label>
              <div className="drag-drop-container">
                <div className="drag-drop-zone">
                  {logoDataURL ? (
                    <div className="selected-image">
                      <img src={logoDataURL} alt="selected file" />
                      <div className="actions">
                        {logoUploadedURL ? (
                          <span className="upload">Uploaded ✅</span>
                        ) : (
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              await uploadLogoImage();
                            }}
                            className="upload-btn"
                            disabled={!logoFile}
                          >
                            Upload
                          </button>
                        )}
                        <button onClick={removeLogo} className="cancel-btn">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div {...getLogoRootProps({ className: "dropzone" })}>
                      <input id="logo" {...getLogoInputProps()} name="logo" />
                      {isLogoDragActive ? (
                        <div className="drop-files">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#5f6368"
                          >
                            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="drag-files">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#000000"
                          >
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                          </svg>
                          <p>Drag & drop a logo </p>
                          <button>click to select one</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Banner image upload section */}
              <label htmlFor="bannerImage" className="banner-image-upload">
                Upload Banner Image
              </label>
              <div className="drag-drop-container">
                <div className="drag-drop-zone">
                  {bannerDataURL ? (
                    <div className="selected-image">
                      <img src={bannerDataURL} alt="" />
                      <div className="actions">
                        {bannerUploadedURL ? (
                          <span className="upload">Uploaded ✅</span>
                        ) : (
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              await uploadBannerImage();
                            }}
                            className="upload-btn"
                            disabled={!bannerFile}
                          >
                            Upload
                          </button>
                        )}
                        <button onClick={removeBanner} className="cancel-btn">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div {...getBannerRootProps({ className: "dropzone" })}>
                      <input
                        id="bannerImage"
                        {...getBannerInputProps()}
                        name="bannerImage"
                      />
                      {isBannerDragActive ? (
                        <div className="drop-files">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#5f6368"
                          >
                            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="drag-files">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#000000"
                          >
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                          </svg>
                          <p>Drag & drop a banner image</p>
                          <button>click to select one</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
