import { useState, useEffect, useCallback, useRef } from "react";
import { ReactSVG } from "react-svg";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "sonner";

// formating controls
import FontSizeControl from "../FontSizeControl/FontSizeControl";
import FontFamilyControl from "../FontFamilyControl/FontFamilyControl";
import TextAlignControl from "../TextAlignment/TextAlignment";
import LineHeightControl from "../LineHeightControl/LineHeightControl";
import PaddingControl from "../PaddingControl/PaddingControl";
import ColorAccessibilityChecker from "../ColorAccessibilityChecker/ColorAccessibilityChecker";
import "./CustomBanner.css";

// images and icons
import Close from "../assets/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import Delete from "../assets/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import Upload from "../assets/upload_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import Bold from "../assets/format_bold_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import Underline from "../assets/format_underlined_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import Italic from "../assets/format_italic_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import Information from "../assets/info_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

const DEFAULT_LOGO = "/Wikipedia-banner.png";
const DEFAULT_BANNER = "/Wikipedia-banner.png";

function CustomBanner() {
  const [displayCta, setDispayCta] = useState(true);
  const [display, setDisplay] = useState(true);

  // handle template
  const [template, setTemplate] = useState("template-one");

  //  state for link
  const [link, setLink] = useState("");

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

    console.log("Selected file:", file);

    const reader = new FileReader();
    reader.onload = () => {
      const binaryStr = reader.result;
      setLogoDataURL(binaryStr);
      localStorage.setItem("logoDataURL", binaryStr);
    };
    reader.readAsDataURL(file);
    setLogoFile(file);
  }, []);

  const onDropRejected = useCallback((fileRejections) => {
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((err) => {
        if (err.code === "file-too-large") {
          window.alert(`"${file.name}" is too large. Max file size is 250KB.`);
        } else {
          window.alert(`File "${file.name}" was rejected: ${err.message}`);
        }
      });
    });
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
    onDropRejected,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 256000, // 250KB
  });

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
    isDragActive: isBannerDragActive,
  } = useDropzone({
    onDrop: onDropBanner,
    onDropRejected,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 256000, // 250KB
  });

  // Upload logo image to Cloudinary - for state persistence and support
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
          headline: "Wiki Loves Africa",
          copyText: "Easter is here - show someone much love",
          ctaBtnText: "Sign up",
        };
  });

  // handle cta backgroundColor
  const [ctaBg, setCtaBg] = useState(bannerStyle.color);

  const handleCtaBg = (e) => {
    setCtaBg(e.target.value);
  };

  // handle display for banner
  const handleDisplay = () => {
    setDisplay((prev) => !prev);
  };

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

  const handleToggle = () => {
    setDispayCta((prev) => !prev);
  };

  // handle landing page link
  const handleLink = (e) => {
    setLink(e.target.value);
  };

  const ctaButtonRef = useRef(null);
  const paragraphRef = useRef(null);
  const [styles, setStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const toggleStyle = (styleType) => {
    const paragraph = paragraphRef.current;

    if (!paragraph) return;

    // Toggle state
    setStyles((prev) => {
      const newStyle = !prev[styleType];
      // Apply the actual style
      switch (styleType) {
        case "bold":
          paragraph.style.fontWeight = newStyle ? "bold" : "normal";
          break;
        case "italic":
          paragraph.style.fontStyle = newStyle ? "italic" : "normal";
          break;
        case "underline":
          paragraph.style.textDecoration = newStyle ? "underline" : "none";
          break;
        default:
          break;
      }
      return { ...prev, [styleType]: newStyle };
    });
  };

  return (
    <div className="banner-form-container">
      <ColorAccessibilityChecker
        textColor={bannerStyle.color}
        backgroundColor={bannerStyle.backgroundColor}
      />
      <div className={`bannerWrapper ${template}`}>
        {display && (
          <div className="banner-container">
            <a
              href={link}
              target="_blank"
              aria-label={`Advertisement: ${bannerCopy.headline}`}
              data-testid="ads-banner-container"
              className="banner-content-container"
              style={{
                backgroundColor: bannerStyle.backgroundColor,
                color: bannerStyle.color,
                padding: "1.5em .9em",
              }}
            >
              {/* BANNNER LOGO */}
              {logoUploadedURL && (
                <div
                  className="logo-image"
                  style={{ backgroundImage: `url(${logoUploadedURL})` }}
                ></div>
              )}

              <div
                className="banner-image"
                style={{ backgroundImage: `url(${bannerUploadedURL})` }}
              ></div>

              <div className="text" ref={paragraphRef}>
                <div className="ads">
                  <h3 className="headline">{bannerCopy.headline}</h3>
                  <p className="copy-text">{bannerCopy.copyText}</p>
                </div>

                {displayCta && (
                  <div className="cta-btn">
                    <button
                      style={{
                        background: ctaBg,
                      }}
                      className="cta"
                      ref={ctaButtonRef}
                    >
                      {bannerCopy.ctaBtnText}
                    </button>
                  </div>
                )}
              </div>
            </a>

            {/* CLOSE BUTTON TO TOGGLE BANNER */}
            <div className="close-btn close-btn-container">
              <button
                className="close-btn"
                onClick={handleDisplay}
                aria-label="Close banner"
              >
                <ReactSVG
                  src={Close}
                  className="close-icon"
                  beforeInjection={(svg) => {
                    svg.setAttribute("width", "14px");
                    svg.setAttribute("height", "14px");
                  }}
                />
                <span inert role="tooltip" className="tooltiptext">
                  Hide
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

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
              <legend className="sr-only">Font Family Selection</legend>
              {/* template picker */}
              <label htmlFor="template-popover" className="template-popover">
                Template{" "}
                <button
                  type="button"
                  popovertarget="mypopover"
                  aria-details="mypopover"
                  aria-expanded="false"
                  id="template-popover"
                  className="popover-btn"
                >
                  <ReactSVG
                    src={Information}
                    beforeInjection={(svg) => {
                      svg.setAttribute("width", "20px");
                      svg.setAttribute("height", "20px");
                    }}
                  />
                  <span inert role="tooltip" className="tooltiptext">
                    More 😳
                  </span>
                </button>
              </label>

              <div id="mypopover" popover="auto">
                Five Banner templates are available, select one that suite your
                style. Proceed to edit selected banner content via input form.
                Banner background and color can also be adjusted. Beware of{" "}
                <span style={{ backgroundColor: "#d1d1d1" }}>
                  {" "}
                  color contrast{" "}
                </span>{" "}
                between text and background.
              </div>
              <select
                onChange={(e) => setTemplate(e.target.value)}
                defaultValue="template-one"
                className="select-option-tag"
                id="template-design"
              >
                <option value="template-one">Template One</option>
                <option value="template-two">Template Two</option>
                <option value="template-three">Template Three</option>
                <option value="template-four">Template Four</option>
                <option value="template-five">Template Five</option>
              </select>

              {/* Background color picker */}
              <label
                htmlFor="backgroundColor"
                className="banner-backgroundColor-change"
              >
                Background color
              </label>

              {/* <p id="bg-desc">set banner background color </p> */}
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={bannerStyle.backgroundColor}
                onChange={handleBannerStyle}
                className="backgroundColor-input"
                aria-label="Background color picker"
                arial-describedby="bg-desc"
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

              <hr />
              {/* Headline input */}
              <label
                htmlFor="headingText"
                className="banner-heading-text-change"
              >
                <sup>*</sup>Headline
              </label>
              <input
                type="text"
                id="headingText"
                name="headline"
                value={bannerCopy.headline}
                onChange={handleCopy}
                className="heading-text-input"
                placeholder="Enter your headline (e.g. 'Spring - 50%)"
                required
                aria-label="Headline"
                maxLength={65}
                aria-describedby="headline-error"
              />
              <span
                id="headline-error"
                className="headline-custom-error"
                role="alert"
              >
                ⚠️ Every great ads needs a headline—what’s yours?
              </span>

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

              {/* Text Formatting Section */}
              <p id="formatting-heading" className="visually-hidden">
                Text Formatting Options
              </p>

              <div className="text-formatter-container">
                <div
                  role="toolbar"
                  aria-label="Text formatting"
                  aria-controls="editable-content"
                  className="format-buttons"
                >
                  <FontFamilyControl targetRef={paragraphRef} />
                  <FontSizeControl targetRef={paragraphRef} />
                  <LineHeightControl targetRef={paragraphRef} />
                  <TextAlignControl targetRef={paragraphRef} />

                  {/* Bold Button */}
                  <button
                    type="button"
                    aria-label="Bold"
                    aria-pressed={styles.bold}
                    onClick={() => toggleStyle("bold")}
                    className={styles.bold ? "style-btn active" : "style-btn"}
                  >
                    <img src={Bold} alt="" aria-hidden="true" />
                    <span inert role="tooltip" className="tooltiptext">
                      Bold
                    </span>
                  </button>

                  {/* Italic Button */}
                  <button
                    type="button"
                    aria-label="Italic"
                    aria-pressed={styles.italic}
                    onClick={() => toggleStyle("italic")}
                    className={styles.italic ? "style-btn active" : "style-btn"}
                  >
                    <img src={Italic} alt="" aria-hidden="true" />
                    <span inert role="tooltip" className="tooltiptext">
                      Italic
                    </span>
                  </button>

                  {/* Underline Button */}
                  <button
                    type="button"
                    aria-label="Underline"
                    aria-pressed={styles.underline}
                    onClick={() => toggleStyle("underline")}
                    className={
                      styles.underline ? "style-btn active" : "style-btn"
                    }
                  >
                    <img src={Underline} alt="" aria-hidden="true" />
                    <span inert role="tooltip" className="tooltiptext">
                      Underline
                    </span>
                  </button>
                </div>
              </div>

              {/* Link to landing page ads */}

              <label
                htmlFor="landingPageUrl"
                className="banner-subtitle-text-change"
              >
                Landing Page Link
              </label>
              <input
                type="text"
                id="landingPageUrl"
                name="landingPageUrl"
                value={link}
                onChange={handleLink}
                className="landing_page"
                placeholder="Enter link to your landing page"
                aria-label="Copy text"
              />

              <hr />
              {/* CTA button text input */}
              <label htmlFor="" id="cta-btn-container">
                <label
                  htmlFor="ctaBtnText"
                  className="banner-cta-btn-text-change"
                  id="cta-btn-text"
                >
                  CTA Button Text
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
                </label>

                <label htmlFor="ctabg" className="ctaBackground">
                  CTA Background
                  <input
                    type="color"
                    id="ctabg"
                    name="color"
                    value={ctaBg}
                    onChange={handleCtaBg}
                    className="color-input"
                    aria-label="Color picker"
                  />
                </label>
                <PaddingControl ctaButtonRef={ctaButtonRef} />
              </label>

              {/* handling the visibilty of  cta button in banner */}
              <div className="visibility-container">
                <div className="visibility-text-container">
                  <p className="visibility-cta-text" id="toggle-desc">
                    Toggle CTA Button
                  </p>
                  <p
                    className="visibility-helper-text"
                    aria-describedby="toggle-desc"
                  >
                    Set visibility of CTA button in the banner
                  </p>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="switch"
                    checked={displayCta}
                    onChange={handleToggle}
                    aria-label="Toggle display"
                  />
                  <label
                    htmlFor="switch"
                    aria-checked={!displayCta}
                    className="toggle-button"
                  >
                    <span className="sr-only">Toggle content visibility</span>
                  </label>
                </div>
              </div>

              <hr />
              {/* Logo upload section */}
              <label
                htmlFor="logo"
                data-test-id="banner-logo-upload"
                className="banner-logo-upload"
              >
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
                            <img src={Upload} alt="" />
                            Upload
                          </button>
                        )}
                        <button onClick={removeLogo} className="cancel-btn">
                          <img src={Delete} alt="" />
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
                          <p>
                            Drag & drop a logo <br />
                            MAX (250KB){" "}
                          </p>
                          <button className="select-btn">
                            click to select one
                          </button>
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
                            <img src={Upload} alt="" />
                            Upload
                          </button>
                        )}
                        <button onClick={removeBanner} className="cancel-btn">
                          <img src={Delete} alt="" />
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
                          <p>
                            Drag & drop a banner <br />
                            image MAX (250KB)
                          </p>
                          <button className="select-btn">
                            click to select one
                          </button>
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

export default CustomBanner;
