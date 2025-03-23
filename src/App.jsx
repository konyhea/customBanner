import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./App.css";
import Close from "./assets/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import Arrow from "./assets/arrow_forward_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

function App() {
  const [display, setDisplay] = useState(true);

  // State for logo
  const [logoDataURL, setLogoDataURL] = useState(
    localStorage.getItem("logoDataURL") || null
  );
  const [logoUploadedURL, setLogoUploadedURL] = useState(
    localStorage.getItem("logoUploadedURL") || null
  );
  const [logoFile, setLogoFile] = useState(null);

  // State for banner image
  const [bannerDataURL, setBannerDataURL] = useState(
    localStorage.getItem("bannerDataURL") || null
  );
  const [bannerUploadedURL, setBannerUploadedURL] = useState(
    localStorage.getItem("bannerUploadedURL") || null
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
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880 // 5MB
  });

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
    isDragActive: isBannerDragActive,
  } = useDropzone({ 
    onDrop: onDropBanner,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880 // 5MB
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
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.statusText}. Details: ${errorText}`);
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
  const uploadBannerImage  = async () => {
    console.log("logoFile state:", bannerFile); // Debugging: Log the logoFile state
    if (!bannerFile) {
      console.log("No file selected for upload");
      return;
    }

    let formData = new FormData();
    formData.append("file", bannerFile);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.statusText}. Details: ${errorText}`);
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
          headline: "The best Gift is here",
          copyText: "The best is here",
          ctaBtnText: "Click Here",
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
              <div className="headline-container">
                <h3 className="headine-copy-text">{bannerCopy.headline}</h3>
              </div>
              <div className="copy-text-container">
                <p className="copy-text">{bannerCopy.copyText}</p>
              </div>
              <div className="cta-btn-container">
                <a href="#">
                  <button className="cta-btn">
                    <span className="cta-text">{bannerCopy.ctaBtnText}</span>
                    <img src={Arrow} alt="Arrow icon indicating action" />
                  </button>
                </a>
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
            action=""
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
                          <span className="upload">Uploaded!</span>
                        ) : (
                          <button
                            onClick={uploadLogoImage}
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
                      <input {...getLogoInputProps()} />
                      {isLogoDragActive ? (
                        <div className="drop-files">
                          <p>Drop the file here...</p>
                        </div>
                      ) : (
                        <div className="drag-files">
                          <p>Drag & drop a logo, or click to select one</p>
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
                          <span className="upload">Uploaded!</span>
                        ) : (
                          <button
                            onClick={uploadBannerImage}
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
                      <input {...getBannerInputProps()} />
                      {isBannerDragActive ? (
                        <div className="drop-files">
                          <p>Drop the file here...</p>
                        </div>
                      ) : (
                        <div className="drag-files">
                          <p>
                            Drag & drop a banner image, or click to select one
                          </p>
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